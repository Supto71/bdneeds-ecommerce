'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bdneeds_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bdneeds_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      // Find if item with same productId and same variantId exists
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          i.variantId === newItem.variantId &&
          i.size === newItem.size &&
          i.storage === newItem.storage
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const target = updated[existingIndex];
        const newQty = Math.min(
          target.maxStock,
          target.quantity + newItem.quantity
        );
        updated[existingIndex] = { ...target, quantity: newQty };
        return updated;
      } else {
        const id = `${newItem.productId}-${newItem.variantId || 'base'}-${newItem.size || ''}-${Date.now()}`;
        return [...prev, { ...newItem, id }];
      }
    });

    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const validQty = Math.min(i.maxStock, quantity);
          return { ...i, quantity: validQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
