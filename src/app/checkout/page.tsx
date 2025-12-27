
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { PlusCircle, MinusCircle, Trash2, ShoppingCart, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, doc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!user) {
        toast({
            title: "Authentication Error",
            description: "You must be logged in to checkout.",
            variant: "destructive",
        });
        return;
    }

    if (cartItems.length === 0) {
      toast({
          title: "Empty Cart",
          description: "You cannot checkout with an empty cart.",
          variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const balanceRef = doc(db, "users", user.uid, "balance", "summary");
    const ordersRef = collection(db, "users", user.uid, "orders");
    const transactionsRef = collection(db, "users", user.uid, "transactions");

    try {
        await runTransaction(db, async (transaction) => {
            const balanceDoc = await transaction.get(balanceRef);
            const currentBalance = balanceDoc.exists() ? balanceDoc.data().currentBalance : 0;

            if (total > currentBalance) {
                throw new Error("Insufficient funds. Please add money to your account.");
            }

            const newBalance = currentBalance - total;
            
            // 1. Update the balance
            transaction.set(balanceRef, { currentBalance: newBalance }, { merge: true });

            // 2. Create the order
            const newOrderRef = doc(ordersRef);
            transaction.set(newOrderRef, {
                date: serverTimestamp(),
                status: "Paid",
                total: total,
                items: cartItems,
            });

            // 3. Create a purchase transaction
            const newTransactionRef = doc(transactionsRef);
            transaction.set(newTransactionRef, {
                type: 'purchase',
                amount: -total,
                date: serverTimestamp(),
                status: 'Completed'
            });
        });

        clearCart();

        toast({
            title: "Order Placed!",
            description: "Your order has been successfully placed and the amount has been deducted from your balance.",
        });

        router.push('/dashboard/profile');

    } catch (error: any) {
        console.error("Error placing order: ", error);
        toast({
            title: "Checkout Error",
            description: error.message || "There was a problem placing your order. Please try again.",
            variant: "destructive",
        });
        if (error.message.includes("Insufficient funds")) {
            router.push('/dashboard/profile');
        }
    } finally {
        setIsProcessing(false);
    }
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-5 w-5 animate-spin" />
            <span>Verifying access...</span>
          </div>
        </div>
    );
  }

  if (!user) {
    return null; // or a login prompt, but useEffect handles redirection
  }

  return (
      <main className="container mx-auto px-4 md:px-6 py-24">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-sans">Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-start gap-4">
                                    <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            data-ai-hint={item.imageHint}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFromCart(item.id)}>
                                                {item.quantity > 1 ? <MinusCircle className="h-4 w-4" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => addToCart(item)}>
                                                <PlusCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes (8%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleCheckout} disabled={isProcessing}>
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isProcessing ? 'Processing...' : 'Place Order'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
          </div>
        )}
      </main>
  );
}
