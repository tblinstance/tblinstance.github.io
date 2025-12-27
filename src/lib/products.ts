
export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  description: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Leather Watch',
    price: 150,
    imageUrl: 'https://picsum.photos/seed/101/600/400',
    imageHint: 'leather watch',
    description: 'A timeless piece that blends classic design with modern functionality. Features a genuine leather strap and a stainless steel case.',
  },
  {
    id: 2,
    name: 'Wireless Bluetooth Headphones',
    price: 99,
    imageUrl: 'https://picsum.photos/seed/102/600/400',
    imageHint: 'wireless headphones',
    description: 'Immerse yourself in high-fidelity sound with these comfortable, noise-cancelling wireless headphones. Long-lasting battery life.',
  },
  {
    id: 3,
    name: 'Minimalist Desk Lamp',
    price: 75,
    imageUrl: 'https://picsum.photos/seed/103/600/400',
    imageHint: 'desk lamp',
    description: 'Illuminate your workspace with this sleek and modern LED desk lamp. Adjustable brightness and a minimalist design.',
  },
  {
    id: 4,
    name: 'Insulated Travel Mug',
    price: 25,
    imageUrl: 'https://picsum.photos/seed/104/600/400',
    imageHint: 'travel mug',
    description: 'Keep your beverages hot or cold for hours. This durable, leak-proof travel mug is perfect for your daily commute.',
  },
  {
    id: 5,
    name: 'Smart Fitness Tracker',
    price: 120,
    imageUrl: 'https://picsum.photos/seed/105/600/400',
    imageHint: 'fitness tracker',
    description: 'Track your steps, heart rate, and workouts with this feature-packed smart fitness tracker. Syncs with your smartphone.',
  },
  {
    id: 6,
    name: 'Artisan Coffee Beans',
    price: 22,
    imageUrl: 'https://picsum.photos/seed/106/600/400',
    imageHint: 'coffee beans',
    description: 'A rich and aromatic blend of single-origin artisan coffee beans, perfect for starting your day right.',
  },
];
