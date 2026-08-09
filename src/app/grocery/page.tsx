'use client';

import { useState } from 'react';
import { useKitchenStore } from '@/store/useKitchenStore';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Share, ShoppingBag, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GroceryPage() {
  const { shoppingList, toggleShopItem } = useKitchenStore();
  const [ownedExpanded, setOwnedExpanded] = useState(false);
  const [swapsActive, setSwapsActive] = useState<{ [key: string]: boolean }>({});

  const missingItems = [
    { name: 'Sun-Dried Tomatoes', price: 2.49 },
    { name: 'Arborio Rice', price: 4.99 },
    { name: 'Chicken Thighs', price: 6.50 },
  ];

  const ownedItems = [
    'Heavy Cream', 'Spinach', 'Parmesan', 'Olive Oil', 'Garlic'
  ];

  const swaps = [
    { original: 'Chicken Thighs', alternative: 'Mushrooms', savings: 6.50 }
  ];

  const toggleSwap = (original: string) => {
    setSwapsActive(prev => ({ ...prev, [original]: !prev[original] }));
  };

  const calculateTotal = () => {
    let total = 0;
    missingItems.forEach(item => {
      // If we swapped this item, don't add to cost
      if (swapsActive[item.name]) return;
      // If it's checked in shopping list, add to cost
      if (shoppingList.includes(item.name)) {
        total += item.price;
      }
    });
    return total;
  };

  return (
    <div className="min-h-screen p-6 pb-32 md:pb-6 md:p-8 max-w-4xl mx-auto flex flex-col">
      <header className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-charcoal dark:text-oatmeal mb-2">Grocery List</h1>
            <p className="text-mutedAsh font-medium">Reconciliation for planned meals</p>
          </div>
          <div className="w-12 h-12 bg-sage/10 text-sage rounded-2xl flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-charcoal text-white dark:bg-oatmeal dark:text-charcoal p-6 rounded-[24px] shadow-lg">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-lg">80% Owned</h3>
            <span className="text-sm text-white/60 dark:text-charcoal/60 font-medium">12 of 15 ingredients</span>
          </div>
          <div className="h-2 w-full bg-white/20 dark:bg-charcoal/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full bg-sage"
            />
          </div>
        </div>
      </header>

      {/* Owned Accordion */}
      <div className="mb-8">
        <button 
          onClick={() => setOwnedExpanded(!ownedExpanded)}
          className="w-full flex items-center justify-between p-4 bg-oatmeal dark:bg-sage/10 rounded-2xl font-bold text-charcoal dark:text-oatmeal transition-colors active:bg-oatmeal/80"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-sage" />
            Owned Ingredients ({ownedItems.length})
          </div>
          {ownedExpanded ? <ChevronUp size={20} className="text-mutedAsh" /> : <ChevronDown size={20} className="text-mutedAsh" />}
        </button>
        
        <AnimatePresence>
          {ownedExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                {ownedItems.map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm font-medium text-mutedAsh">
                    <CheckCircle2 size={16} className="text-sage opacity-50" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Missing Items & Swaps */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-charcoal dark:text-oatmeal mb-4">To Buy</h2>
        <div className="space-y-4">
          {missingItems.map(item => {
            const isSwapped = swapsActive[item.name];
            const isChecked = shoppingList.includes(item.name);
            const swapOption = swaps.find(s => s.original === item.name);

            return (
              <div key={item.name} className="flex flex-col gap-2">
                <motion.div 
                  layout
                  onClick={() => !isSwapped && toggleShopItem(item.name)}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSwapped 
                      ? 'bg-oatmeal/50 dark:bg-charcoal/30 border-mutedAsh/10 opacity-50 grayscale pointer-events-none' 
                      : isChecked
                        ? 'bg-white dark:bg-charcoal border-sage shadow-sm shadow-sage/10'
                        : 'bg-white dark:bg-charcoal border-mutedAsh/20 hover:border-mutedAsh/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={isChecked && !isSwapped ? 'text-sage' : 'text-mutedAsh/40'}>
                      {isChecked && !isSwapped ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </div>
                    <span className={`font-bold text-lg ${isChecked && !isSwapped ? 'text-charcoal dark:text-oatmeal' : 'text-charcoal/70 dark:text-oatmeal/70'}`}>
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-mutedAsh">${item.price.toFixed(2)}</span>
                </motion.div>

                {/* Swap Suggestion */}
                {swapOption && (
                  <div className="ml-12 p-3 bg-sage/5 border border-sage/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-sage/20 text-sage rounded-lg">
                        <ArrowRightLeft size={16} />
                      </div>
                      <span className="text-sm font-medium text-charcoal dark:text-oatmeal">
                        Swap for <span className="font-bold text-sage">{swapOption.alternative}</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => toggleSwap(item.name)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        isSwapped 
                          ? 'bg-sage text-white' 
                          : 'bg-white dark:bg-charcoal border border-mutedAsh/20 text-charcoal dark:text-oatmeal hover:border-sage'
                      }`}
                    >
                      {isSwapped ? 'Swapped' : 'Apply (Skip buying)'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer fixed for mobile */}
      <footer className="fixed bottom-16 md:bottom-0 left-0 right-0 md:relative md:mt-12 bg-white/90 dark:bg-charcoal/90 backdrop-blur-md border-t border-mutedAsh/20 md:border-t-0 p-6 z-30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex w-full md:w-auto items-center justify-between md:justify-start md:gap-8">
            <span className="text-mutedAsh font-medium">Estimated Total</span>
            <span className="text-3xl font-black text-charcoal dark:text-oatmeal">${calculateTotal().toFixed(2)}</span>
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-charcoal dark:bg-oatmeal text-white dark:text-charcoal py-4 md:py-3 px-8 rounded-2xl font-bold shadow-lg shadow-charcoal/20 active:scale-95 transition-all">
            <Share size={20} />
            Export List
          </button>
        </div>
      </footer>
    </div>
  );
}
