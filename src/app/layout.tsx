
"use client"

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // The navbar should not be shown on auth pages.
  const showNavbar = !['/login', '/signup', '/forgot-password'].some(p => pathname.startsWith(p));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AuthFlow</title>
        <meta name="description" content="Seamless Authentication with Firebase and Next.js" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
            <CartProvider>
                <div className="bg-background text-foreground min-h-screen">
                  {showNavbar && <Navbar />}
                  {children}
                  <Toaster />
                </div>
            </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
