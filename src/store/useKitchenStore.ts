import { create } from 'zustand';

export type Item = { 
  id: string; 
  name: string; 
  qty: string; 
  expiresHours: number; 
  category: string; 
};

export type Recipe = { 
  id: string; 
  title: string; 
  matchPct: number; 
  time: number; 
  savesExpiringCount: number; 
  missing: string[]; 
  steps: string[];
};

interface Store {
  inventory: Item[];
  recipes: Recipe[];
  shoppingList: string[];
  stats: { mealsSaved: number; moneySaved: number; co2Saved: number };
  markUsed: (id: string) => void;
  addItem: (item: Item) => void;
  toggleShopItem: (item: string) => void;
}

const mockInventory: Item[] = [
  { id: '1', name: 'Greek Yogurt', qty: '1 tub', expiresHours: 96, category: 'Dairy' },
  { id: '2', name: 'Heavy Cream', qty: '1/2 cup', expiresHours: 48, category: 'Dairy' },
  { id: '3', name: 'Spinach', qty: '200g', expiresHours: 12, category: 'Produce' },
  { id: '4', name: 'Chicken Breast', qty: '2 lbs', expiresHours: 72, category: 'Meat' },
];

const mockRecipes: Recipe[] = [
  { 
    id: '1', 
    title: 'Creamy Tuscan Pasta', 
    matchPct: 100, 
    time: 18, 
    savesExpiringCount: 3, 
    missing: [],
    steps: [
      'Boil pasta in salted water until al dente.',
      'Sauté spinach in a pan until wilted.',
      'Add 200g Spinach and 1/2 cup Heavy Cream.',
      'Simmer until thickened, then toss with pasta.',
    ]
  },
  { 
    id: '2', 
    title: 'Wild Mushroom Risotto', 
    matchPct: 90, 
    time: 30, 
    savesExpiringCount: 1, 
    missing: ['Rice', 'Mushrooms'],
    steps: [
      'Sauté mushrooms and set aside.',
      'Toast rice and gradually add broth.',
      'Stir continuously until creamy.',
      'Fold in mushrooms and parmesan.',
    ]
  },
];

export const useKitchenStore = create<Store>((set) => ({
  inventory: mockInventory,
  recipes: mockRecipes,
  shoppingList: ['Sun-Dried Tomatoes'],
  stats: { mealsSaved: 14, moneySaved: 42.50, co2Saved: 6.2 },
  markUsed: (id) => set((state) => ({ 
    inventory: state.inventory.filter((item) => item.id !== id) 
  })),
  addItem: (item) => set((state) => ({ 
    inventory: [...state.inventory, item] 
  })),
  toggleShopItem: (item) => set((state) => ({
    shoppingList: state.shoppingList.includes(item) 
      ? state.shoppingList.filter((i) => i !== item)
      : [...state.shoppingList, item]
  })),
}));
