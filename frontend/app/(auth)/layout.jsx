import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-bengali',
});

export default function AuthLayout({ children }) {
  return (
    <html
      lang="en"
      className={cn('h-full', inter.variable, notoSansBengali.variable)}
      suppressHydrationWarning
    >
      <body
        className={cn(
          'antialiased flex h-full text-base text-foreground bg-background',
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="nextjs-theme"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <AuthProvider>
            <TooltipProvider delayDuration={0}>
              {children}
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

