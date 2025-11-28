import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-bengali',
});

export default function PublicLayout({ children }) {
  return (
    <html lang="en" className={cn('h-full', inter.variable, notoSansBengali.variable)}>
      <body
        className={cn(
          'antialiased flex h-full text-base text-foreground bg-background',
          inter.className
        )}
      >
        {children}
      </body>
    </html>
  );
}

