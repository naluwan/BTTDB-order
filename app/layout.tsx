import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/providers/toaster-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '昔日大飯店點餐系統',
  description: '昔日大飯店點餐系統',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='zh-tw'>
      <body className={inter.className}>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
