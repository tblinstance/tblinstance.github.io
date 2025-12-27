
import ProductPageClient from '@/components/Product-Page';
import Navbar from '@/components/Navbar';

export default function ProductPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 py-24">
        {/* The client component now fetches its own data */}
        <ProductPageClient />
      </main>
    </div>
  );
}
