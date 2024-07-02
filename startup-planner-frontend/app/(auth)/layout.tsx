import { Bricolage_Grotesque } from 'next/font/google'
import { cn } from '@/lib/utils'
import '../globals.css'
import { Toaster } from "@/components/ui/toaster";
import Logo from '@/components/ui/logo';

const fontHeading = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'antialiased',
          fontHeading.className,
        )}
      >
        <Logo />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
