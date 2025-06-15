import React, { createContext, useContext, useState } from 'react';

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'service' | 'goods' | 'rental';
  subcategory: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  location: string;
  datePosted: string;
  isAvailable: boolean;
  tags: string[];
  rentalDuration?: string;
}

interface ItemContextType {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'datePosted'>) => void;
  getItemById: (id: string) => Item | undefined;
  searchItems: (query: string) => Item[];
  filterByCategory: (category: string) => Item[];
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};

export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([
    {
      id: '1',
      title: 'Assignment Help - Data Structures',
      description: 'I can help you with your Data Structures assignments, coding problems, and projects. Quick turnaround guaranteed!',
      price: 500,
      category: 'service',
      subcategory: 'assignments',
      images: ['https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg'],
      sellerId: '2',
      sellerName: 'Rahul Sharma',
      sellerRating: 4.9,
      location: 'Campus',
      datePosted: '2024-01-15',
      isAvailable: true,
      tags: ['programming', 'coding', 'assignments']
    },
    {
      id: '2',
      title: 'iPhone 13 - Excellent Condition',
      description: 'Selling my iPhone 13 in excellent condition. No scratches, all accessories included. Reason for selling: upgraded to iPhone 15.',
      price: 45000,
      category: 'goods',
      subcategory: 'tech',
      images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
      sellerId: '3',
      sellerName: 'Priya Patel',
      sellerRating: 4.7,
      location: 'Hostel A',
      datePosted: '2024-01-14',
      isAvailable: true,
      tags: ['smartphone', 'apple', 'tech']
    },
    {
      id: '3',
      title: 'Power Bank Rental - 20000mAh',
      description: 'High capacity power bank available for rent. Perfect for long study sessions or trips. Rental includes charging cable.',
      price: 50,
      category: 'rental',
      subcategory: 'electronics',
      images: ['https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg'],
      sellerId: '4',
      sellerName: 'Amit Kumar',
      sellerRating: 4.6,
      location: 'Library Area',
      datePosted: '2024-01-13',
      isAvailable: true,
      tags: ['powerbank', 'rental', 'electronics'],
      rentalDuration: 'per day'
    }
  ]);

  const addItem = (newItem: Omit<Item, 'id' | 'datePosted'>) => {
    const item: Item = {
      ...newItem,
      id: Date.now().toString(),
      datePosted: new Date().toISOString().split('T')[0]
    };
    setItems(prev => [item, ...prev]);
  };

  const getItemById = (id: string) => {
    return items.find(item => item.id === id);
  };

  const searchItems = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return items.filter(item =>
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const filterByCategory = (category: string) => {
    if (category === 'all') return items;
    return items.filter(item => item.category === category);
  };

  return (
    <ItemContext.Provider value={{
      items,
      addItem,
      getItemById,
      searchItems,
      filterByCategory
    }}>
      {children}
    </ItemContext.Provider>
  );
};