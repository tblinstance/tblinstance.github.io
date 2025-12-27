
"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/client";
import { collection, doc, getDocs, setDoc, onSnapshot } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreditCard, Home, Landmark, PlusCircle, Loader2 } from "lucide-react"

const addressSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

type PaymentMethod = {
  id: string;
  cardType: string;
  last4: string;
  expiry: string;
}

export default function BillingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const addressRef = doc(db, "users", user.uid, "addresses", "billing");
    const pmRef = collection(db, "users", user.uid, "paymentMethods");

    const unsubAddress = onSnapshot(addressRef, (docSnap) => {
      if (docSnap.exists()) {
        form.reset(docSnap.data() as AddressFormData);
      }
    });

    const unsubPms = onSnapshot(pmRef, (snapshot) => {
      const pms: PaymentMethod[] = [];
      snapshot.forEach(doc => {
          const data = doc.data();
          pms.push({
              id: doc.id,
              cardType: data.cardType,
              last4: data.last4,
              expiry: data.expiry,
          });
      });
      setPaymentMethods(pms);
      setLoading(false);
    });

    return () => {
      unsubAddress();
      unsubPms();
    };
  }, [user, form]);


  const onSubmit = async (data: AddressFormData) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    try {
      const addressRef = doc(db, "users", user.uid, "addresses", "billing");
      await setDoc(addressRef, data, { merge: true });
      toast({
        title: "Success!",
        description: "Your billing address has been saved.",
      });
    } catch (error) {
      console.error("Error saving address: ", error);
      toast({
        title: "Error",
        description: "Could not save your address.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard /> Payment Methods</CardTitle>
            <CardDescription>
              Manage your saved payment methods.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : paymentMethods.length > 0 ? (
                <div className="grid gap-4">
                    {paymentMethods.map(pm => (
                        <div key={pm.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <Landmark className="h-6 w-6 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{pm.cardType} **** {pm.last4}</p>
                                    <p className="text-sm text-muted-foreground">Expires {pm.expiry}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Edit</Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-4">
                    <p>No payment methods found.</p>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a new payment method
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Home /> Billing Address</CardTitle>
            <CardDescription>Update your billing address.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                     <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                     <FormField
                        control={form.control}
                        name="zip"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="94103" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="USA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                   {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                   {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
