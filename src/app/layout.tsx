
"use client"

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import './globals.css';

// Metadata can still be exported from a client component in the root layout
export const metadata: Metadata = {
  title: 'AuthFlow',
  description: 'Seamless Authentication with Firebase and Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showNavbar = !['/login', '/signup', '/forgot-password'].includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
