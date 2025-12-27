
"use client";

import Navbar from '@/components/Navbar';
import PricingCard from '@/components/PricingCard';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/products';
import { Cpu, MemoryStick, HardDrive, Server, Globe, Users, Database, ArrowRightLeft, Box, Layers, Terminal, CloudCog } from "lucide-react";


export default function Home() {
  const { toast } = useToast();
  const { addToCart } = useCart();

  const handleAddToCart = (planName: string, price: number) => {
    // We need a unique-ish ID. A real app would have proper product IDs.
    const productId = new Date().getTime() + Math.random();
    
    const product: Product = {
      id: productId,
      name: planName,
      price: price,
      // The cart expects an image, so we'll use a generic placeholder.
      imageUrl: 'https://picsum.photos/seed/hosting/600/400',
      imageHint: 'server cloud',
      description: `Hosting plan: ${planName}`,
    };
    
    addToCart(product);

    toast({
      title: "Added to Cart",
      description: `${planName} has been added to your cart.`,
    });
  };

  const vpsPlans = [
    {
      name: "VPS S",
      price: 5.99,
      features: [
        { icon: Cpu, text: "4 vCPU Cores" },
        { icon: MemoryStick, text: "8 GB RAM" },
        { icon: HardDrive, text: "50 GB NVMe" },
      ],
      featured: false,
    },
    {
      name: "VPS M",
      price: 10.99,
      features: [
        { icon: Cpu, text: "6 vCPU Cores" },
        { icon: MemoryStick, text: "16 GB RAM" },
        { icon: HardDrive, text: "100 GB NVMe" },
      ],
      featured: true,
    },
    {
      name: "VPS L",
      price: 19.99,
      features: [
        { icon: Cpu, text: "8 vCPU Cores" },
        { icon: MemoryStick, text: "30 GB RAM" },
        { icon: HardDrive, text: "200 GB NVMe" },
      ],
      featured: false,
    },
    {
        name: "VPS XL",
        price: 35.99,
        features: [
            { icon: Cpu, text: "10 vCPU Cores" },
            { icon: MemoryStick, text: "60 GB RAM" },
            { icon: HardDrive, text: "400 GB NVMe" },
        ],
        featured: false,
    }
  ];

  const vdsPlans = [
    {
      name: "VDS S",
      price: 49.99,
      features: [
        { icon: Cpu, text: "8 Dedicated vCores" },
        { icon: MemoryStick, text: "32 GB RAM" },
        { icon: HardDrive, text: "400 GB NVMe" },
      ],
      featured: false,
    },
    {
      name: "VDS M",
      price: 89.99,
      features: [
        { icon: Cpu, text: "12 Dedicated vCores" },
        { icon: MemoryStick, text: "64 GB RAM" },
        { icon: HardDrive, text: "800 GB NVMe" },
      ],
      featured: true,
    },
    {
      name: "VDS L",
      price: 159.99,
      features: [
        { icon: Cpu, text: "16 Dedicated vCores" },
        { icon: MemoryStick, text: "128 GB RAM" },
        { icon: HardDrive, text: "1.6 TB NVMe" },
      ],
      featured: false,
    },
  ];

  const bareMetalPlans = [
    {
      name: "Intel Xeon E-2336",
      price: 129.99,
      features: [
        { icon: Server, text: "6 Cores / 12 Threads" },
        { icon: MemoryStick, text: "64 GB DDR4 ECC RAM" },
        { icon: HardDrive, text: "2 x 1 TB NVMe SSD" },
      ],
      featured: false,
    },
    {
      name: "AMD EPYC 7402P",
      price: 249.99,
      features: [
        { icon: Server, text: "24 Cores / 48 Threads" },
        { icon: MemoryStick, text: "128 GB DDR4 ECC RAM" },
        { icon: HardDrive, text: "2 x 2 TB NVMe SSD" },
      ],
      featured: true,
    },
    {
      name: "Dual Intel Xeon Gold",
      price: 499.99,
      features: [
        { icon: Server, text: "32 Cores / 64 Threads" },
        { icon: MemoryStick, text: "256 GB DDR4 ECC RAM" },
        { icon: HardDrive, text: "2 x 4 TB NVMe SSD" },
      ],
      featured: false,
    },
  ];
  
  const sharedHostingPlans = [
    {
      name: "Starter",
      price: 2.99,
      features: [
        { icon: Globe, text: "1 Website" },
        { icon: HardDrive, text: "10 GB SSD Storage" },
        { icon: ArrowRightLeft, text: "Unmetered Bandwidth" },
      ],
      featured: false,
    },
    {
      name: "Business",
      price: 6.99,
      features: [
        { icon: Globe, text: "10 Websites" },
        { icon: HardDrive, text: "50 GB SSD Storage" },
        { icon: ArrowRightLeft, text: "Unmetered Bandwidth" },
      ],
      featured: true,
    },
    {
      name: "Pro",
      price: 12.99,
      features: [
        { icon: Globe, text: "Unlimited Websites" },
        { icon: HardDrive, text: "100 GB SSD Storage" },
        { icon: ArrowRightLeft, text: "Unmetered Bandwidth" },
      ],
      featured: false,
    },
  ];

  const wordpressPlans = [
    {
      name: "WP Basic",
      price: 4.99,
      features: [
        { icon: Globe, text: "1 WordPress Site" },
        { icon: HardDrive, text: "20 GB NVMe Storage" },
        { icon: Users, text: "~25k Monthly Visitors" },
      ],
      featured: false,
    },
    {
      name: "WP Plus",
      price: 9.99,
      features: [
        { icon: Globe, text: "5 WordPress Sites" },
        { icon: HardDrive, text: "100 GB NVMe Storage" },
        { icon: Users, text: "~100k Monthly Visitors" },
      ],
      featured: true,
    },
    {
      name: "WP Pro",
      price: 18.99,
      features: [
        { icon: Globe, text: "Unlimited Sites" },
        { icon: HardDrive, text: "200 GB NVMe Storage" },
        { icon: Users, text: "~400k Monthly Visitors" },
      ],
      featured: false,
    },
  ];

  const mysqlPlans = [
    {
      name: "MySQL Dev",
      price: 15.00,
      features: [
        { icon: Database, text: "1 GB Database" },
        { icon: MemoryStick, text: "1 GB RAM" },
        { icon: Cpu, text: "1 vCPU" },
      ],
      featured: false,
    },
    {
      name: "MySQL Prod",
      price: 60.00,
      features: [
        { icon: Database, text: "25 GB Database" },
        { icon: MemoryStick, text: "4 GB RAM" },
        { icon: Cpu, text: "2 vCPU" },
      ],
      featured: true,
    },
    {
      name: "MySQL Cluster",
      price: 120.00,
      features: [
        { icon: Database, text: "50 GB Database" },
        { icon: MemoryStick, text: "8 GB RAM" },
        { icon: Cpu, text: "4 vCPU" },
      ],
      featured: false,
    },
  ];

  const kubernetesPlans = [
    {
      name: "K8s Starter",
      price: 79.00,
      features: [
        { icon: Box, text: "3 Nodes" },
        { icon: Cpu, text: "2 vCPU / Node" },
        { icon: MemoryStick, text: "4 GB RAM / Node" },
      ],
      featured: false,
    },
    {
      name: "K8s Professional",
      price: 149.00,
      features: [
        { icon: Box, text: "5 Nodes" },
        { icon: Cpu, text: "4 vCPU / Node" },
        { icon: MemoryStick, text: "8 GB RAM / Node" },
      ],
      featured: true,
    },
    {
      name: "K8s Enterprise",
      price: 299.00,
      features: [
        { icon: Box, text: "10 Nodes" },
        { icon: Cpu, text: "8 vCPU / Node" },
        { icon: MemoryStick, text: "16 GB RAM / Node" },
      ],
      featured: false,
    },
  ];

  const postgresqlPlans = [
    {
      name: "Postgres Dev",
      price: 20.00,
      features: [
        { icon: Database, text: "10 GB Storage" },
        { icon: MemoryStick, text: "2 GB RAM" },
        { icon: Cpu, text: "1 vCPU" },
      ],
      featured: false,
    },
    {
      name: "Postgres Prod",
      price: 80.00,
      features: [
        { icon: Database, text: "50 GB Storage" },
        { icon: MemoryStick, text: "8 GB RAM" },
        { icon: Globe, text: "High Availability" },
      ],
      featured: true,
    },
    {
      name: "Postgres Cluster",
      price: 160.00,
      features: [
        { icon: Database, text: "100 GB Storage" },
        { icon: MemoryStick, text: "16 GB RAM" },
        { icon: Globe, text: "High Availability Cluster" },
      ],
      featured: false,
    },
  ];

  const openstackPlans = [
    {
      name: "OpenStack Starter",
      price: 99.00,
      features: [
        { icon: Layers, text: "100 vCPU Hours" },
        { icon: MemoryStick, text: "200 GB RAM Hours" },
        { icon: HardDrive, text: "1 TB Object Storage" },
      ],
      featured: false,
    },
    {
      name: "OpenStack Business",
      price: 299.00,
      features: [
        { icon: Layers, text: "500 vCPU Hours" },
        { icon: MemoryStick, text: "1000 GB RAM Hours" },
        { icon: HardDrive, text: "5 TB Object Storage" },
      ],
      featured: true,
    },
    {
      name: "OpenStack Enterprise",
      price: 799.00,
      features: [
        { icon: Layers, text: "2000 vCPU Hours" },
        { icon: MemoryStick, text: "4000 GB RAM Hours" },
        { icon: HardDrive, text: "20 TB Object Storage" },
      ],
      featured: false,
    },
  ];

  const devstackPlans = [
    {
      name: "Managed DevStack",
      price: 149.00,
      features: [
        { icon: Terminal, text: "All-in-one Node" },
        { icon: Cpu, text: "8 vCPU" },
        { icon: MemoryStick, text: "32 GB RAM" },
      ],
      featured: true,
    },
  ];

  const opennebulaPlans = [
    {
      name: "OpenNebula Basic",
      price: 79.00,
      features: [
        { icon: CloudCog, text: "Managed Cloud" },
        { icon: Cpu, text: "16 vCPU" },
        { icon: MemoryStick, text: "64 GB RAM" },
      ],
      featured: false,
    },
    {
      name: "OpenNebula Pro",
      price: 249.00,
      features: [
        { icon: CloudCog, text: "Dedicated Cluster" },
        { icon: Cpu, text: "64 vCPU" },
        { icon: MemoryStick, text: "256 GB RAM" },
      ],
      featured: true,
    },
  ];

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 py-24">
        <div className="grid gap-24">
            <section id="vps-plans">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-sans">Our VPS Plans</h2>
                    <p className="text-muted-foreground mt-2 text-lg">High performance virtual servers with shared resources. Perfect for getting started.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {vpsPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} onAddToCart={() => handleAddToCart(plan.name, plan.price)} />
                    ))}
                </div>
            </section>

            <section id="vds-plans">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-sans">VDS Plans</h2>
                    <p className="text-muted-foreground mt-2 text-lg">Virtual Dedicated Servers with guaranteed resources for more demanding applications.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {vdsPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} onAddToCart={() => handleAddToCart(plan.name, plan.price)} />
                    ))}
                </div>
            </section>

            <section id="bare-metal-servers">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-sans">Bare Metal Servers</h2>
                    <p className="text-muted-foreground mt-2 text-lg">Maximum power and performance with fully dedicated physical hardware.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {bareMetalPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} onAddToCart={() => handleAddToCart(plan.name, plan.price)} />
                    ))}
                </div>
            </section>

            <section id="shared-hosting">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-sans">Shared Hosting</h2>
                    <p className="text-muted-foreground mt-2 text-lg">Affordable, reliable hosting for personal websites and blogs.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {sharedHostingPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} onAddToCart={() => handleAddToCart(plan.name, plan.price)} />
                    ))}
                </div>
            </section>

            <section id="wordpress-hosting">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-sans">WordPress Hosting</h2>
                    <p className="text-muted-foreground mt-2 text-lg">Optimized hosting for WordPress sites with enhanced speed and security.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {wordpressPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} onAddToCart={() => handleAddToCart(plan.name, plan.price)} />
                    ))}
                </div>
            </section>

            <section id="mysql-hosting">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-sans">MySQL Hosting</h2>
                    <p className="text-muted-foreground mt-2 text-lg">Managed MySQL databases for your applications, optimized for performance and reliability.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {mysqlPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} onAddToCart={() => handleAddToCart(plan.name, plan.price)} />
                    ))}
                </div>
            </section>

            <section id="kubernetes-hosting">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-sans">Kubernetes Hosting</h2>
                    <p className="text-muted-foreground mt-2 text-lg">Deploy and scale containerized applications with our managed K8s service.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {kubernetesPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} onAddToCart={() => handleAddToCart(plan.name, plan.price)} />
                    ))}
                </div>
            </section>

            <section id="postgresql-hosting">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-sans">PostgreSQL Hosting</h2>
                    <p className="text-muted-foreground mt-2 text-lg">Powerful, open-source object-relational database system, fully managed.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {postgresqlPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} onAddToCart={() => handleAddToCart(plan.name, plan.price)} />
                    ))}
                </div>
            </section>

            <section id="openstack-cloud">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-sans">OpenStack Cloud</h2>
                    <p className="text-muted-foreground mt-2 text-lg">Flexible and powerful IaaS for building private and public clouds.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {openstackPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} onAddToCart={() => handleAddToCart(plan.name, plan.price)} />
                    ))}
                </div>
            </section>

            <section id="managed-devstack">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-sans">Managed DevStack</h2>
                    <p className="text-muted-foreground mt-2 text-lg">A ready-to-use OpenStack development environment, managed for you.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 justify-center">
                    <div className="lg:col-start-2">
                        {devstackPlans.map((plan, index) => (
                            <PricingCard key={index} {...plan} onAddToCart={() => handleAddToCart(plan.name, plan.price)} />
                        ))}
                    </div>
                </div>
            </section>

            <section id="opennebula-cloud">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold font-sans">OpenNebula Cloud</h2>
                    <p className="text-muted-foreground mt-2 text-lg">Simple, robust, and enterprise-ready cloud management platform.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {opennebulaPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} onAddToCart={() => handleAddToCart(plan.name, plan.price)} />
                    ))}
                </div>
            </section>
        </div>
      </main>

      <footer className="w-full border-t py-6 mt-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
            <p className="text-muted-foreground">
              Built with Next.js, Firebase, and ShadCN/UI
            </p>
        </div>
      </footer>
    </div>
  );
}

    