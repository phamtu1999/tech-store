import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductResponse } from '../api';

interface CartItem extends ProductResponse {
  quantity: number;
  selectedColor?: string;
  selectedVariant?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: ProductResponse, options?: { color?: string; variant?: string }) => void;
  removeFromCart: (productId: number, options?: { color?: string; variant?: string }) => void;
  updateQuantity: (productId: number, delta: number, options?: { color?: string; variant?: string }) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem('techzone_cart');
        if (stored) {
          setCartItems(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load cart', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('techzone_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product: ProductResponse, options?: { color?: string; variant?: string }) => {
    setCartItems(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedColor === options?.color && 
        item.selectedVariant === options?.variant
      );

      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.selectedColor === options?.color && item.selectedVariant === options?.variant) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedColor: options?.color, selectedVariant: options?.variant }];
    });
  };

  const removeFromCart = (productId: number, options?: { color?: string; variant?: string }) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === productId && item.selectedColor === options?.color && item.selectedVariant === options?.variant)
    ));
  };

  const updateQuantity = (productId: number, delta: number, options?: { color?: string; variant?: string }) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId && item.selectedColor === options?.color && item.selectedVariant === options?.variant) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalPrice,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
