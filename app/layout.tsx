import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StytchProvider } from '@/components/stytch-provider';
import { AmplitudeProvider } from '@/components/amplitude-provider';
import { getSEOTags, renderSchemaTags } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

export const metadata = getSEOTags({ canonicalUrlRelative: '/' });

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{renderSchemaTags()}</head>
      <body className={inter.className}>
        <StytchProvider>
          <AmplitudeProvider>{children}</AmplitudeProvider>
        </StytchProvider>
      </body>
    </html>
  );
}
