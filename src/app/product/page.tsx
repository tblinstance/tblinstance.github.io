
import ProductPageClient from '@/components/Product-Page';
import Navbar from '@/components/Navbar';
import { products } from '@/lib/products';

// For this example, we'll just use the first product.
// A real app would use dynamic routing to fetch a specific product.
const product = products[0];

export default function ProductPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 py-24">
        <ProductPageClient product={product} />
      </main>
    </div>
  );
}
