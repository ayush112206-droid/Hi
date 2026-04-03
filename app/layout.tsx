import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { SecurityWrapper } from '@/components/SecurityWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata = {
  title: 'VIP Study | Premium Test Series',
  description: 'A premium study platform for competitive exams by Raj.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-[#050505] text-white min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <SecurityWrapper>
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#050505_100%)]" />
          <main className="relative z-0">{children}</main>
        </SecurityWrapper>
      </body>
    </html>
  );
}
