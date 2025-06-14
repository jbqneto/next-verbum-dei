import './globals.css';
import type { Metadata } from 'next';
import { Merriweather, Inter } from 'next/font/google';
import I18nProvider from '@/components/I18nProvider';

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather'
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Verbum Dei AI - Catholic Spiritual Assistant',
  description: 'AI-powered Catholic spiritual guidance for faith, prayer, and doctrine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${merriweather.variable} ${inter.variable} font-serif`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}