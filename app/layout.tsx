import type { Metadata } from 'next';
import './globals.css';
import ShellLayout from '@/components/Layout/ShellLayout';

export const metadata: Metadata = {
  title: 'GREENMIND | GenAI Green Campus Assistant',
  description: 'From Campus Problems to Sustainable Actions. AI-Powered Campus Sustainability for Colleges.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ShellLayout>
          {children}
        </ShellLayout>
      </body>
    </html>
  );
}
