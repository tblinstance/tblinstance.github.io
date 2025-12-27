
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/products';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase/client';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  loadingCart: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const getCartRef = useCallback((userId: string) => {
      if (!userId) return null;
      return doc(db, 'carts', userId);
  }, []);

  // Effect to handle cart merging and loading from Firestore
  useEffect(() => {
    async function mergeAndLoadCart() {
      if (user && !authLoading) {
        setLoadingCart(true);
        const localCartRaw = localStorage.getItem('guestCart');
        const localCart: CartItem[] = localCartRaw ? JSON.parse(localCartRaw) : [];
        const cartRef = getCartRef(user.uid);
        
        if (cartRef) {
          const docSnap = await getDoc(cartRef);
          let firestoreCart: CartItem[] = [];
          if (docSnap.exists() && docSnap.data().items) {
              firestoreCart = docSnap.data().items;
          }

          let mergedCart = [...firestoreCart];

          if (localCart.length > 0) {
            localCart.forEach(localItem => {
              const existingItemIndex = mergedCart.findIndex(item => item.id === localItem.id);
              if (existingItemIndex > -1) {
                mergedCart[existingItemIndex].quantity += localItem.quantity;
              } else {
                mergedCart.push(localItem);
              }
            });
            // Clear local cart after merging
            localStorage.removeItem('guestCart');
          }
          
          await setDoc(cartRef, { items: mergedCart });
          setCartItems(mergedCart);
        }
        setLoadingCart(false);
      } else if (!authLoading) {
        // Guest user
        setLoadingCart(true);
        const localCart = localStorage.getItem('guestCart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
        setLoadingCart(false);
      }
    }
    mergeAndLoadCart();
  }, [user, authLoading, getCartRef]);


  // Effect for real-time updates from Firestore
  useEffect(() => {
      if (user && !loadingCart) {
          const cartRef = getCartRef(user.uid);
          if (cartRef) {
              const unsubscribe = onSnapshot(cartRef, (doc) => {
                  if (doc.exists()) {
                      setCartItems(doc.data().items || []);
                  } else {
                      setCartItems([]);
                  }
              });
              return () => unsubscribe();
          }
      }
  }, [user, loadingCart, getCartRef]);


  // Effect to save guest cart to localStorage
  useEffect(() => {
    if (!user && !loadingCart) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, user, loadingCart]);

  const updateCartInFirestore = async (newCartItems: CartItem[]) => {
      if (user) {
          const cartRef = getCartRef(user.uid);
          if (cartRef) {
              await setDoc(cartRef, { items: newCartItems }, { merge: true });
          }
      }
  };

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...prevItems, { ...product, quantity: 1 }];
      }
      if (user) updateCartInFirestore(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const newItems = prevItems.reduce((acc, item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
      if (user) updateCartInFirestore(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      const cartRef = getCartRef(user.uid);
      if (cartRef) {
        setDoc(cartRef, { items: [] });
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, loadingCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
