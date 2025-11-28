import { Suspense } from 'react';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/lib/providers/query-provider';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });
const notoSansBengali = Noto_Sans_Bengali({ 
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-bengali',
});

export const metadata = {
  title: {
    template: '%s | Binirman BD',
    default: 'Binirman BD',
  },
};

export default async function RootLayout({ children }) {
  return (
    <html 
      className={cn('h-full', notoSansBengali.variable)} 
      suppressHydrationWarning
      style={{
        fontFamily: 'var(--font-noto-sans-bengali), sans-serif',
      }}
    >
      <body
        className={cn(
          'antialiased flex h-full text-base text-foreground bg-background',
          notoSansBengali.className,
          notoSansBengali.variable,
        )}
        style={{
          fontFamily: 'var(--font-noto-sans-bengali), sans-serif',
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="nextjs-theme"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <QueryProvider>
            <AuthProvider>
              <TooltipProvider delayDuration={0}>
                <Suspense>{children}</Suspense>
                <Toaster />
              </TooltipProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
