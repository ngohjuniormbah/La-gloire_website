import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageToggle } from '../components/LanguageToggle';
import { api, ApiError, getToken, setToken } from '../api';
import { adminText, AdminText } from '../i18n/admin';
import {
  Campaign,
  ContactMessage,
  DonationRecord,
  GalleryItem,
  Language,
  MediaItem,
  MemberRecord,
  Review,
  SiteSettings
} from '../types';

/* ------------------------------------------------------------------ */
/* Types & shared styles                                               */
/* ------------------------------------------------------------------ */
interface AdminData {
  settings: SiteSettings;
  campaigns: Campaign[];
  media: MediaItem[];
  gallery: GalleryItem[];
  reviews: Review[];
  donations: DonationRecord[];
  members: MemberRecord[];
  messages: ContactMessage[];
}

type TabId = 'photos' | 'videos' | 'pdfs' | 'missions' | 'reviews' | 'inbox' | 'settings';

interface TabProps {
  a: AdminText;
  language: Language;
  notify: (message: string) => void;
  fail: (err: unknown) => void;
  reload: () => Promise<void>;
}

const inputCls =
  'w-full px-3 py-2 text-sm bg-white text-slate-800 border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#1C295E] placeholder:text-slate-400';
const primaryBtn =
  'inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1C295E] hover:bg-[#152048] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors';
const secondaryBtn =
  'inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:border-[#1C295E] hover:text-[#1C295E] cursor-pointer transition-colors';
const linkBtn = 'text-xs font-semibold text-slate-500 hover:text-[#1C295E] hover:underline cursor-pointer';
const cardCls = 'border border-slate-200 rounded-xl p-5 sm:p-6';
const listCls = 'divide-y divide-slate-200 border border-slate-200 rounded-xl';

const describeError = (err: unknown, a: AdminText): string => {
  if (err instanceof ApiError) {
    if (err.code === 'network') return a.errNetwork;
    if (err.code === 'too_large') return a.errTooLarge(err.maxMb || 200);
    if (err.code === 'invalid_type') return a.errType;
  }
  return a.errGeneric;
};

const downloadCsv = (filename: string, headers: string[], rows: (string | number | undefined)[][]) => {
  const cell = (v: string | number | undefined) => {
    let s = String(v ?? '');
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // neutralise spreadsheet formulas
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = '\uFEFF' + [headers, ...rows].map((r) => r.map(cell).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
interface TabDef {
  id: string;
  label: string;
  count?: number;
}

/** Plain text tabs: no fill, no shadow. Only a thin underline marks the active one. */
const TextTabs: React.FC<{
  tabs: TabDef[];
  active: string;
  onChange: (id: string) => void;
  small?: boolean;
}> = ({ tabs, active, onChange, small }) => (
  <div role="tablist" className={`flex overflow-x-auto border-b border-slate-200 ${small ? 'gap-5' : 'gap-7'}`}>
    {tabs.map((tab) => {
      const isActive = tab.id === active;
      return (
        <button
          key={tab.id}
          role="tab"
          type="button"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
          className={`-mb-px pb-3 whitespace-nowrap border-b-2 font-medium cursor-pointer transition-colors ${
            small ? 'text-xs pb-2' : 'text-sm'
          } ${
            isActive
              ? 'border-[#1C295E] text-[#1C295E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {tab.label}
          {tab.count ? <span className="ml-1.5 font-normal text-slate-400">{tab.count}</span> : null}
        </button>
      );
    })}
  </div>
);

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <label className="block">
    <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>
    {children}
    {hint ? <span className="block text-[11px] text-slate-400 mt-1">{hint}</span> : null}
  </label>
);

const Section: React.FC<{ title: string; intro?: string; children: React.ReactNode }> = ({
  title,
  intro,
  children
}) => (
  <section className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-[#1C295E]">{title}</h2>
      {intro ? <p className="text-sm text-slate-500 mt-1">{intro}</p> : null}
    </div>
    {children}
  </section>
);

const Empty: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl px-5 py-8 text-center">
    {text}
  </p>
);

/* ------------------------------------------------------------------ */
/* Source input: paste a link OR import a file from the device         */
/* ------------------------------------------------------------------ */
interface SourceValue {
  mode: 'link' | 'upload';
  url: string;
  fileName: string;
}

const EMPTY_SOURCE: SourceValue = { mode: 'link', url: '', fileName: '' };

const ACCEPT: Record<'image' | 'video' | 'pdf', string> = {
  image: '.jpg,.jpeg,.png,.webp,.gif',
  video: '.mp4,.webm,.mov',
  pdf: '.pdf'
};

const SourceInput: React.FC<{
  kind: 'image' | 'video' | 'pdf';
  value: SourceValue;
  onChange: (v: SourceValue) => void;
  onBusy: (busy: boolean) => void;
  onError: (err: unknown) => void;
  a: AdminText;
  optional?: boolean;
  label?: string;
}> = ({ kind, value, onChange, onBusy, onError, a, optional, label }) => {
  const [progress, setProgress] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setProgress(0);
    onBusy(true);
    try {
      const url = await api.upload(file, kind, setProgress);
      onChange({ mode: 'upload', url, fileName: file.name });
    } catch (err) {
      onError(err);
    } finally {
      setProgress(null);
      onBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const showPreview = kind === 'image' && value.url;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-slate-600">
          {label || (kind === 'image' ? 'Image' : kind === 'video' ? 'Video' : 'PDF')}
          {optional ? <span className="font-normal text-slate-400"> ({a.optional})</span> : null}
        </span>
        <TextTabs
          small
          active={value.mode}
          onChange={(id) => onChange({ mode: id as 'link' | 'upload', url: '', fileName: '' })}
          tabs={[
            { id: 'link', label: a.sourceLink },
            { id: 'upload', label: a.sourceDevice }
          ]}
        />
      </div>

      {value.mode === 'link' ? (
        <input
          type="url"
          value={value.url}
          onChange={(e) => onChange({ mode: 'link', url: e.target.value, fileName: '' })}
          placeholder={a.linkPlaceholder}
          aria-label={a.linkLabel}
          className={inputCls}
        />
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={progress !== null}
              className={secondaryBtn}
            >
              {value.fileName ? a.changeFile : a.chooseFile}
            </button>
            <span className="text-xs text-slate-500 truncate max-w-full">
              {progress !== null
                ? `${a.uploading} ${progress}%`
                : value.fileName
                  ? `${a.uploadDone} · ${value.fileName}`
                  : a.noFile}
            </span>
          </div>
          {progress !== null && (
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#1C295E] transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT[kind]}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {showPreview && (
        <img
          src={value.url}
          alt=""
          className="h-24 w-auto max-w-full rounded-lg border border-slate-200 object-cover"
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Bilingual text fields                                               */
/* ------------------------------------------------------------------ */
interface Texts {
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
}
const EMPTY_TEXTS: Texts = { titleFr: '', titleEn: '', descFr: '', descEn: '' };

const TextFields: React.FC<{ value: Texts; onChange: (v: Texts) => void; a: AdminText }> = ({
  value,
  onChange,
  a
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label={`${a.titleFr} *`}>
        <input
          type="text"
          required
          value={value.titleFr}
          onChange={(e) => onChange({ ...value, titleFr: e.target.value })}
          className={inputCls}
        />
      </Field>
      <Field label={`${a.titleEn} (${a.optional})`}>
        <input
          type="text"
          value={value.titleEn}
          onChange={(e) => onChange({ ...value, titleEn: e.target.value })}
          className={inputCls}
        />
      </Field>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label={`${a.descFr} (${a.optional})`}>
        <textarea
          rows={2}
          value={value.descFr}
          onChange={(e) => onChange({ ...value, descFr: e.target.value })}
          className={inputCls}
        />
      </Field>
      <Field label={`${a.descEn} (${a.optional})`} hint={a.englishFallback}>
        <textarea
          rows={2}
          value={value.descEn}
          onChange={(e) => onChange({ ...value, descEn: e.target.value })}
          className={inputCls}
        />
      </Field>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Photos                                                              */
/* ------------------------------------------------------------------ */
const PhotosTab: React.FC<TabProps & { items: GalleryItem[] }> = ({ a, language, notify, fail, reload, items }) => {
  const [texts, setTexts] = useState<Texts>(EMPTY_TEXTS);
  const [source, setSource] = useState<SourceValue>(EMPTY_SOURCE);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.url) return notify(a.errNeedSource);
    setSaving(true);
    try {
      await api.create('gallery', { ...texts, src: source.url, source: source.mode });
      setTexts(EMPTY_TEXTS);
      setSource(EMPTY_SOURCE);
      await reload();
      notify(a.published);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(a.confirmDelete)) return;
    try {
      await api.remove('gallery', id);
      await reload();
      notify(a.deleted);
    } catch (err) {
      fail(err);
    }
  };

  return (
    <Section title={a.photos.title} intro={a.photos.intro}>
      <form onSubmit={submit} className={`${cardCls} space-y-5`}>
        <h3 className="text-sm font-semibold text-slate-800">{a.photos.addTitle}</h3>
        <TextFields value={texts} onChange={setTexts} a={a} />
        <SourceInput kind="image" value={source} onChange={setSource} onBusy={setBusy} onError={fail} a={a} />
        <button type="submit" disabled={busy || saving} className={primaryBtn}>
          {saving ? a.publishing : a.publish}
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">
          {a.photos.listTitle} <span className="font-normal text-slate-400">{items.length}</span>
        </h3>
        {items.length === 0 ? (
          <Empty text={a.photos.empty} />
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <li key={item.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <img src={item.src} alt="" className="h-40 w-full object-cover bg-slate-100" />
                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {language === 'fr' ? item.titleFr : item.titleEn}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                    <button type="button" onClick={() => remove(item.id)} className={linkBtn}>
                      {a.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* Videos & PDFs (same flow)                                           */
/* ------------------------------------------------------------------ */
const MediaTab: React.FC<TabProps & { type: 'video' | 'pdf'; items: MediaItem[] }> = ({
  a,
  language,
  notify,
  fail,
  reload,
  type,
  items
}) => {
  const copy = type === 'video' ? a.videos : a.pdfs;
  const [texts, setTexts] = useState<Texts>(EMPTY_TEXTS);
  const [source, setSource] = useState<SourceValue>(EMPTY_SOURCE);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.url) return notify(a.errNeedSource);
    setSaving(true);
    try {
      await api.create('media', {
        type,
        titleFr: texts.titleFr,
        titleEn: texts.titleEn,
        descriptionFr: texts.descFr,
        descriptionEn: texts.descEn,
        url: source.url,
        source: source.mode
      });
      setTexts(EMPTY_TEXTS);
      setSource(EMPTY_SOURCE);
      await reload();
      notify(a.published);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(a.confirmDelete)) return;
    try {
      await api.remove('media', id);
      await reload();
      notify(a.deleted);
    } catch (err) {
      fail(err);
    }
  };

  return (
    <Section title={copy.title} intro={copy.intro}>
      <form onSubmit={submit} className={`${cardCls} space-y-5`}>
        <h3 className="text-sm font-semibold text-slate-800">{copy.addTitle}</h3>
        <TextFields value={texts} onChange={setTexts} a={a} />
        <SourceInput
          kind={type === 'video' ? 'video' : 'pdf'}
          value={source}
          onChange={setSource}
          onBusy={setBusy}
          onError={fail}
          a={a}
        />
        <button type="submit" disabled={busy || saving} className={primaryBtn}>
          {saving ? a.publishing : a.publish}
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">
          {copy.listTitle} <span className="font-normal text-slate-400">{items.length}</span>
        </h3>
        {items.length === 0 ? (
          <Empty text={copy.empty} />
        ) : (
          <ul className={listCls}>
            {items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {language === 'fr' ? item.titleFr : item.titleEn}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {item.source === 'upload' ? a.fromUpload : a.fromLink} · {item.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className={linkBtn}>
                    {a.open}
                  </a>
                  <button type="button" onClick={() => remove(item.id)} className={linkBtn}>
                    {a.remove}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* Missions                                                            */
/* ------------------------------------------------------------------ */
const CampaignRow: React.FC<
  TabProps & { item: Campaign; onRemove: (id: string) => void }
> = ({ a, language, notify, fail, reload, item, onRemove }) => {
  const [raised, setRaised] = useState(String(item.currentAmount || 0));
  const pct = item.targetAmount > 0 ? Math.min(100, Math.round((item.currentAmount / item.targetAmount) * 100)) : 0;

  const update = async () => {
    try {
      await api.patch('campaigns', item.id, { currentAmount: Number(raised) || 0 });
      await reload();
      notify(a.saved);
    } catch (err) {
      fail(err);
    }
  };

  return (
    <li className="px-4 py-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="h-14 w-20 rounded-lg object-cover border border-slate-200 shrink-0" />
          ) : null}
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800">{language === 'fr' ? item.titleFr : item.titleEn}</p>
            {item.location ? <p className="text-[11px] text-slate-400">{item.location}</p> : null}
          </div>
        </div>
        <button type="button" onClick={() => onRemove(item.id)} className={linkBtn}>
          {a.remove}
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-44">
          <Field label={a.missions.raised}>
            <input
              type="number"
              min={0}
              value={raised}
              onChange={(e) => setRaised(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <button type="button" onClick={update} className={secondaryBtn}>
          {a.missions.update}
        </button>
        <span className="text-xs text-slate-500 pb-2">
          {item.currentAmount.toLocaleString()} / {item.targetAmount.toLocaleString()} FCFA · {pct}%
        </span>
      </div>
    </li>
  );
};

const MissionsTab: React.FC<TabProps & { items: Campaign[] }> = (props) => {
  const { a, notify, fail, reload, items } = props;
  const [texts, setTexts] = useState<Texts>(EMPTY_TEXTS);
  const [location, setLocation] = useState('');
  const [target, setTarget] = useState('');
  const [raised, setRaised] = useState('');
  const [cover, setCover] = useState<SourceValue>(EMPTY_SOURCE);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.create('campaigns', {
        titleFr: texts.titleFr,
        titleEn: texts.titleEn,
        descriptionFr: texts.descFr,
        descriptionEn: texts.descEn,
        location,
        targetAmount: Number(target) || 0,
        currentAmount: Number(raised) || 0,
        imageUrl: cover.url || undefined
      });
      setTexts(EMPTY_TEXTS);
      setLocation('');
      setTarget('');
      setRaised('');
      setCover(EMPTY_SOURCE);
      await reload();
      notify(a.published);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(a.confirmDelete)) return;
    try {
      await api.remove('campaigns', id);
      await reload();
      notify(a.deleted);
    } catch (err) {
      fail(err);
    }
  };

  return (
    <Section title={a.missions.title} intro={a.missions.intro}>
      <form onSubmit={submit} className={`${cardCls} space-y-5`}>
        <h3 className="text-sm font-semibold text-slate-800">{a.missions.addTitle}</h3>
        <TextFields value={texts} onChange={setTexts} a={a} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label={a.missions.location}>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} />
          </Field>
          <Field label={a.missions.target}>
            <input type="number" min={0} value={target} onChange={(e) => setTarget(e.target.value)} className={inputCls} />
          </Field>
          <Field label={a.missions.raised}>
            <input type="number" min={0} value={raised} onChange={(e) => setRaised(e.target.value)} className={inputCls} />
          </Field>
        </div>
        <SourceInput
          kind="image"
          value={cover}
          onChange={setCover}
          onBusy={setBusy}
          onError={fail}
          a={a}
          optional
          label={a.missions.cover}
        />
        <button type="submit" disabled={busy || saving} className={primaryBtn}>
          {saving ? a.publishing : a.publish}
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">
          {a.missions.listTitle} <span className="font-normal text-slate-400">{items.length}</span>
        </h3>
        {items.length === 0 ? (
          <Empty text={a.missions.empty} />
        ) : (
          <ul className={listCls}>
            {items.map((item) => (
              <CampaignRow key={item.id} {...props} item={item} onRemove={remove} />
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */
const ReviewsTab: React.FC<TabProps & { items: Review[] }> = ({ a, notify, fail, reload, items }) => {
  const toggle = async (item: Review) => {
    try {
      await api.patch('reviews', item.id, { approved: !item.approved });
      await reload();
    } catch (err) {
      fail(err);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(a.confirmDelete)) return;
    try {
      await api.remove('reviews', id);
      await reload();
      notify(a.deleted);
    } catch (err) {
      fail(err);
    }
  };

  return (
    <Section title={a.reviews.title} intro={a.reviews.intro}>
      {items.length === 0 ? (
        <Empty text={a.reviews.empty} />
      ) : (
        <ul className={listCls}>
          {items.map((item) => (
            <li key={item.id} className="px-4 py-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {[item.roleOrCity, item.date].filter(Boolean).join(' · ')} · {'★'.repeat(item.rating)}
                    {'☆'.repeat(Math.max(0, 5 - item.rating))}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {item.approved ? a.reviews.live : a.reviews.pending}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{item.comment}</p>
              <div className="flex items-center gap-4 pt-1">
                <button type="button" onClick={() => toggle(item)} className={secondaryBtn}>
                  {item.approved ? a.reviews.unpublish : a.reviews.approve}
                </button>
                <button type="button" onClick={() => remove(item.id)} className={linkBtn}>
                  {a.remove}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* Inbox: messages, donation intents, members                          */
/* ------------------------------------------------------------------ */
type InboxTabId = 'messages' | 'donations' | 'members';

const InboxTab: React.FC<
  TabProps & { messages: ContactMessage[]; donations: DonationRecord[]; members: MemberRecord[] }
> = ({ a, notify, fail, reload, messages, donations, members }) => {
  const [sub, setSub] = useState<InboxTabId>('messages');

  const setStatus = async (col: 'messages' | 'donations', id: string, status: string) => {
    try {
      await api.patch(col, id, { status });
      await reload();
    } catch (err) {
      fail(err);
    }
  };

  const remove = async (col: 'messages' | 'donations' | 'members', id: string) => {
    if (!window.confirm(a.confirmDelete)) return;
    try {
      await api.remove(col, id);
      await reload();
      notify(a.deleted);
    } catch (err) {
      fail(err);
    }
  };

  const selectCls = `${inputCls} !w-auto !py-1 text-xs`;
  const th = 'text-left text-[11px] font-medium text-slate-500 px-4 py-2 whitespace-nowrap';
  const td = 'px-4 py-3 align-top text-sm text-slate-700';

  const today = new Date().toISOString().split('T')[0];

  return (
    <Section title={a.inbox.title}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex-1 min-w-0">
          <TextTabs
            small
            active={sub}
            onChange={(id) => setSub(id as InboxTabId)}
            tabs={[
              { id: 'messages', label: a.inbox.messages, count: messages.length },
              { id: 'donations', label: a.inbox.donations, count: donations.length },
              { id: 'members', label: a.inbox.members, count: members.length }
            ]}
          />
        </div>
        <button
          type="button"
          className={secondaryBtn}
          onClick={() => {
            if (sub === 'messages') {
              downloadCsv(
                `messages-${today}.csv`,
                [a.inbox.colDate, a.inbox.colName, 'Email', 'Subject', 'Message', a.inbox.status],
                messages.map((m) => [m.date, m.name, m.email, m.subject, m.message, m.status])
              );
            } else if (sub === 'donations') {
              downloadCsv(
                `donations-${today}.csv`,
                [a.inbox.colReference, a.inbox.colName, 'Email', 'Phone', a.inbox.colPlace, a.inbox.colProject, a.inbox.colDate, a.inbox.status, 'Message'],
                donations.map((d) => [
                  d.receiptNumber,
                  d.donorName,
                  d.email,
                  d.phone,
                  [d.city, d.country].filter(Boolean).join(', '),
                  d.campaignTitle,
                  d.date,
                  d.status,
                  d.message
                ])
              );
            } else {
              downloadCsv(
                `members-${today}.csv`,
                [a.inbox.colNumber, a.inbox.colName, 'Email', 'Phone', a.inbox.colPlace, a.inbox.colDate],
                members.map((m) => [
                  m.membershipNumber,
                  m.fullName,
                  m.email,
                  m.phone,
                  [m.city, m.country].filter(Boolean).join(', '),
                  m.joinedDate
                ])
              );
            }
          }}
        >
          {a.exportCsv}
        </button>
      </div>

      {sub === 'messages' &&
        (messages.length === 0 ? (
          <Empty text={a.inbox.emptyMessages} />
        ) : (
          <ul className={listCls}>
            {messages.map((m) => (
              <li key={m.id} className="px-4 py-4 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{m.subject || m.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {m.name} ·{' '}
                      <a href={`mailto:${m.email}`} className="hover:text-[#1C295E] hover:underline">
                        {m.email}
                      </a>{' '}
                      · {m.date}
                    </p>
                  </div>
                  <select
                    value={m.status}
                    onChange={(e) => setStatus('messages', m.id, e.target.value)}
                    className={selectCls}
                    aria-label={a.inbox.status}
                  >
                    <option value="new">{a.inbox.msgNew}</option>
                    <option value="replied">{a.inbox.msgReplied}</option>
                    <option value="archived">{a.inbox.msgArchived}</option>
                  </select>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{m.message}</p>
                <button type="button" onClick={() => remove('messages', m.id)} className={linkBtn}>
                  {a.remove}
                </button>
              </li>
            ))}
          </ul>
        ))}

      {sub === 'donations' &&
        (donations.length === 0 ? (
          <Empty text={a.inbox.emptyDonations} />
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full min-w-[720px]">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className={th}>{a.inbox.colReference}</th>
                  <th className={th}>{a.inbox.colName}</th>
                  <th className={th}>{a.inbox.colContact}</th>
                  <th className={th}>{a.inbox.colProject}</th>
                  <th className={th}>{a.inbox.colDate}</th>
                  <th className={th}>{a.inbox.status}</th>
                  <th className={th} />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td className={`${td} whitespace-nowrap`}>{d.receiptNumber}</td>
                    <td className={td}>
                      {d.donorName}
                      <span className="block text-[11px] text-slate-400">
                        {[d.city, d.country].filter(Boolean).join(', ')}
                      </span>
                    </td>
                    <td className={td}>
                      <a href={`mailto:${d.email}`} className="hover:text-[#1C295E] hover:underline">
                        {d.email}
                      </a>
                      {d.phone ? <span className="block text-[11px] text-slate-400">{d.phone}</span> : null}
                    </td>
                    <td className={td}>
                      {d.campaignTitle || a.inbox.general}
                      {d.message ? <span className="block text-[11px] text-slate-400">{d.message}</span> : null}
                    </td>
                    <td className={`${td} whitespace-nowrap`}>{d.date}</td>
                    <td className={td}>
                      <select
                        value={d.status}
                        onChange={(e) => setStatus('donations', d.id, e.target.value)}
                        className={selectCls}
                        aria-label={a.inbox.status}
                      >
                        <option value="pending_contact">{a.inbox.donPending}</option>
                        <option value="processing">{a.inbox.donProcessing}</option>
                        <option value="completed">{a.inbox.donCompleted}</option>
                      </select>
                    </td>
                    <td className={td}>
                      <button type="button" onClick={() => remove('donations', d.id)} className={linkBtn}>
                        {a.remove}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {sub === 'members' &&
        (members.length === 0 ? (
          <Empty text={a.inbox.emptyMembers} />
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full min-w-[640px]">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className={th}>{a.inbox.colNumber}</th>
                  <th className={th}>{a.inbox.colName}</th>
                  <th className={th}>{a.inbox.colContact}</th>
                  <th className={th}>{a.inbox.colPlace}</th>
                  <th className={th}>{a.inbox.colDate}</th>
                  <th className={th} />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {members.map((m) => (
                  <tr key={m.id}>
                    <td className={`${td} whitespace-nowrap`}>{m.membershipNumber}</td>
                    <td className={td}>{m.fullName}</td>
                    <td className={td}>
                      <a href={`mailto:${m.email}`} className="hover:text-[#1C295E] hover:underline">
                        {m.email}
                      </a>
                      {m.phone ? <span className="block text-[11px] text-slate-400">{m.phone}</span> : null}
                    </td>
                    <td className={td}>{[m.city, m.country].filter(Boolean).join(', ')}</td>
                    <td className={`${td} whitespace-nowrap`}>{m.joinedDate}</td>
                    <td className={td}>
                      <button type="button" onClick={() => remove('members', m.id)} className={linkBtn}>
                        {a.remove}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* Contact info                                                        */
/* ------------------------------------------------------------------ */
const SettingsTab: React.FC<TabProps & { settings: SiteSettings }> = ({ a, notify, fail, reload, settings }) => {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.saveSettings(form);
      await reload();
      notify(a.saved);
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title={a.settings.title} intro={a.settings.intro}>
      <form onSubmit={submit} className={`${cardCls} space-y-4 max-w-2xl`}>
        <Field label={a.settings.churchName}>
          <input type="text" value={form.churchName} onChange={set('churchName')} className={inputCls} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={a.settings.address}>
            <input type="text" value={form.address} onChange={set('address')} className={inputCls} />
          </Field>
          <Field label={a.settings.cityCountry}>
            <input type="text" value={form.cityCountry} onChange={set('cityCountry')} className={inputCls} />
          </Field>
          <Field label={a.settings.phone}>
            <input type="tel" value={form.phone} onChange={set('phone')} className={inputCls} />
          </Field>
          <Field label={a.settings.prayerLine}>
            <input type="tel" value={form.prayerLine} onChange={set('prayerLine')} className={inputCls} />
          </Field>
        </div>
        <Field label={a.settings.email}>
          <input type="email" value={form.email} onChange={set('email')} className={inputCls} />
        </Field>
        <button type="submit" disabled={saving} className={primaryBtn}>
          {a.save}
        </button>
      </form>
    </Section>
  );
};

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */
const LoginPanel: React.FC<{ a: AdminText; notice: string; onSuccess: () => void }> = ({ a, notice, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { token } = await api.login(password);
      setToken(token);
      setPassword('');
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setError(a.wrongPassword);
      else if (err instanceof ApiError && err.status === 429) setError(a.tooManyAttempts);
      else setError(describeError(err, a));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-5">
      <div className="space-y-1">
        <h1 className="font-cinzel text-2xl font-bold text-[#1C295E]">{a.loginTitle}</h1>
        <p className="text-sm text-slate-500">{a.loginIntro}</p>
      </div>
      {(notice || error) && (
        <p role="alert" className="text-sm text-[#1C295E] border border-slate-300 rounded-lg px-3 py-2">
          {error || notice}
        </p>
      )}
      <Field label={a.password}>
        <input
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
      </Field>
      <button type="submit" disabled={busy} className={`${primaryBtn} w-full`}>
        {a.unlock}
      </button>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export const AdminView: React.FC = () => {
  const { language, setActivePage, refreshContent } = useApp();
  const a = adminText[language];

  const [authed, setAuthed] = useState<boolean>(() => !!getToken());
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<TabId>('photos');
  const [notice, setNotice] = useState('');
  const [loginNotice, setLoginNotice] = useState('');
  const noticeTimer = useRef<number | undefined>(undefined);

  const notify = useCallback((message: string) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 4000);
  }, []);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const logout = useCallback(() => {
    setToken('');
    setAuthed(false);
    setData(null);
  }, []);

  const fail = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        setLoginNotice(a.errSessionExpired);
        return;
      }
      notify(describeError(err, a));
    },
    [a, logout, notify]
  );

  const reload = useCallback(async () => {
    const state = (await api.getAdminState()) as AdminData;
    setData(state);
    refreshContent();
  }, [refreshContent]);

  useEffect(() => {
    if (!authed) return;
    reload().catch(fail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  /* ----- signed out ----- */
  if (!authed) {
    return (
      <div className="min-h-screen bg-white text-slate-800 flex flex-col">
        <div className="flex justify-end px-4 sm:px-8 py-4">
          <LanguageToggle />
        </div>
        <div className="flex-1 flex items-center justify-center px-4 pb-24">
          <LoginPanel
            a={a}
            notice={loginNotice}
            onSuccess={() => {
              setLoginNotice('');
              setAuthed(true);
            }}
          />
        </div>
      </div>
    );
  }

  const videos = data?.media.filter((m) => m.type === 'video') ?? [];
  const pdfs = data?.media.filter((m) => m.type === 'pdf') ?? [];
  const newMessages = data?.messages.filter((m) => m.status === 'new').length ?? 0;

  const tabs: TabDef[] = [
    { id: 'photos', label: a.tabs.photos, count: data?.gallery.length },
    { id: 'videos', label: a.tabs.videos, count: videos.length },
    { id: 'pdfs', label: a.tabs.pdfs, count: pdfs.length },
    { id: 'missions', label: a.tabs.missions, count: data?.campaigns.length },
    { id: 'reviews', label: a.tabs.reviews, count: data?.reviews.length },
    { id: 'inbox', label: a.tabs.inbox, count: newMessages },
    { id: 'settings', label: a.tabs.settings }
  ];

  const common: TabProps = { a, language, notify, fail, reload };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-cinzel text-lg font-bold text-[#1C295E]">La Gloire de Dieu</span>
            <span className="text-sm text-slate-500">{a.brand}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button type="button" onClick={() => setActivePage('home')} className={secondaryBtn}>
              {a.viewSite}
            </button>
            <button type="button" onClick={logout} className={linkBtn}>
              {a.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-8">
        <TextTabs tabs={tabs} active={tab} onChange={(id) => setTab(id as TabId)} />

        {notice && (
          <p role="status" className="text-sm text-[#1C295E] border border-slate-300 rounded-lg px-3 py-2">
            {notice}
          </p>
        )}

        {!data ? (
          <p className="text-sm text-slate-500">{a.loading}</p>
        ) : (
          <>
            {tab === 'photos' && <PhotosTab key="photos" {...common} items={data.gallery} />}
            {tab === 'videos' && <MediaTab key="videos" {...common} type="video" items={videos} />}
            {tab === 'pdfs' && <MediaTab key="pdfs" {...common} type="pdf" items={pdfs} />}
            {tab === 'missions' && <MissionsTab key="missions" {...common} items={data.campaigns} />}
            {tab === 'reviews' && <ReviewsTab key="reviews" {...common} items={data.reviews} />}
            {tab === 'inbox' && (
              <InboxTab
                key="inbox"
                {...common}
                messages={data.messages}
                donations={data.donations}
                members={data.members}
              />
            )}
            {tab === 'settings' && <SettingsTab key="settings" {...common} settings={data.settings} />}
          </>
        )}
      </main>
    </div>
  );
};
