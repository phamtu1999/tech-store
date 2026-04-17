import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductResponse } from '../api';

interface WishlistContextType {
  wishlistItems: ProductResponse[];
  toggleWishlist: (product: ProductResponse) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<ProductResponse[]>([]);

  useEffect(() => {
    const loadWishlist = async () => {
      const stored = await AsyncStorage.getItem('wishlist');
      if (stored) setWishlistItems(JSON.parse(stored));
    };
    loadWishlist();
  }, []);

  const toggleWishlist = async (product: ProductResponse) => {
    let newItems;
    const exists = wishlistItems.find(item => item.id === product.id);
    if (exists) {
      newItems = wishlistItems.filter(item => item.id !== product.id);
    } else {
      newItems = [...wishlistItems, product];
    }
    setWishlistItems(newItems);
    await AsyncStorage.setItem('wishlist', JSON.stringify(newItems));
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
