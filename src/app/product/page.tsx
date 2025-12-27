
"use client";

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { products } from '@/lib/products';
import { ShoppingCart, Star } from 'lucide-react';

// For this example, we'll just display the first product.
// A real app would use dynamic routing to show a specific product.
const product = products[0];

export default function ProductPage() {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={product.imageUrl}
              alt={product.name}
              data-ai-hint={product.imageHint}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight">{product.name}</h1>
              <p className="text-2xl font-semibold mt-2">${product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current text-gray-300" />
              </div>
              <span className="text-muted-foreground text-sm">(123 reviews)</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            <div className="mt-4">
              <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
