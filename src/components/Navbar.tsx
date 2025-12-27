
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Zap, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const { user, loading } = useAuth();
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-sans text-xl font-semibold">
          <div className="p-2 bg-primary rounded-lg">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>AuthFlow</span>
        </Link>
        <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
                <Link href="/product">Product</Link>
            </Button>
            <Link href="/checkout" className="relative">
                <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Shopping Cart</span>
                </Button>
                {totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{totalItems}</Badge>
                )}
            </Link>
            {!loading && (
                <>
                    {user ? (
                        <Button asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button asChild variant="ghost">
                                <Link href="/login">Log In</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
      </div>
    </header>
  );
}
