import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'La Gloire de Dieu | Foi, Succès, Bonheur, Destinée',
  description: 'La Gloire de Dieu — association de foi, de prière, d’enseignement et d’action solidaire.',
  icons: { icon: '/la-gloire-de-dieu-logo.webp' }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
