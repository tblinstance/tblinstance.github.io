
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ShoppingCart } from "lucide-react";

type PricingCardProps = {
  name: string;
  price: number;
  features: {
    icon: LucideIcon;
    text: string;
  }[];
  featured?: boolean;
  onAddToCart: () => void;
};

export default function PricingCard({ name, price, features, featured = false, onAddToCart }: PricingCardProps) {
  return (
    <Card className={cn("flex flex-col", featured && "border-primary ring-2 ring-primary")}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <feature.icon className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={featured ? "default" : "outline"} onClick={onAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Choose Plan
        </Button>
      </CardFooter>
    </Card>
  );
}

    