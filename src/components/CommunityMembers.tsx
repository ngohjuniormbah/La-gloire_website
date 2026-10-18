import React from 'react';
import { useApp } from '../context/AppContext';

/** Row of member profile icons with the name below each one. Renders nothing when there are no members. */
export const CommunityMembers: React.FC = () => {
  const { communityMembers, language } = useApp();
  if (!communityMembers.length) return null;

  return (
    <div className="space-y-6">
      <p className="text-xs uppercase tracking-wider text-slate-500 font-medium text-center">
        {language === 'fr' ? 'Notre communauté' : 'Our community'}
      </p>
      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-6">
        {communityMembers.map((member) => (
          <li key={member.id} className="w-24 text-center">
            <img
              src={member.avatar}
              alt=""
              loading="lazy"
              className="w-20 h-20 rounded-full mx-auto object-cover"
            />
            <p className="mt-2 text-xs font-medium text-slate-700 leading-snug">{member.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
