'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Camera, Plus, X, ArrowRight, CheckCircle2, Sparkles, ChevronDown, Search } from 'lucide-react';
import { useKitchenStore } from '@/store/useKitchenStore';

// Suggested ingredient chips for quick-add
const suggestions = [
  'Eggs', 'Milk', 'Butter', 'Onion', 'Garlic', 'Tomato', 'Chicken',
  'Rice', 'Pasta', 'Cheese', 'Potato', 'Carrot', 'Spinach', 'Lemon',
  'Olive Oil', 'Flour', 'Bread', 'Mushrooms', 'Bell Pepper', 'Salmon',
];

// Expiry labels for newly added items
const expiryOptions = [
  { label: 'Expires Today', hours: 12 },
  { label: 'Expires in 2 days', hours: 48 },
  { label: 'Fresh (1 week)', hours: 168 },
  { label: 'Stocked (1 month)', hours: 720 },
];

// A simplified recipe matcher based on ingredient names
const allRecipes = [
  {
    id: '1',
    title: 'Creamy Tuscan Pasta',
    ingredients: ['Pasta', 'Spinach', 'Heavy Cream', 'Garlic', 'Cheese'],
    time: 18,
    emoji: '🍝',
  },
  {
    id: '2',
    title: 'Wild Mushroom Risotto',
    ingredients: ['Rice', 'Mushrooms', 'Butter', 'Garlic', 'Cheese'],
    time: 30,
    emoji: '🍄',
  },
  {
    id: '3',
    title: 'Scrambled Eggs & Toast',
    ingredients: ['Eggs', 'Butter', 'Bread', 'Milk'],
    time: 10,
    emoji: '🍳',
  },
  {
    id: '4',
    title: 'Garlic Butter Chicken',
    ingredients: ['Chicken', 'Butter', 'Garlic', 'Lemon', 'Olive Oil'],
    time: 25,
    emoji: '🍗',
  },
  {
    id: '5',
    title: 'Tomato Pasta',
    ingredients: ['Pasta', 'Tomato', 'Garlic', 'Olive Oil'],
    time: 20,
    emoji: '🍅',
  },
  {
    id: '6',
    title: 'Salmon with Veggies',
    ingredients: ['Salmon', 'Lemon', 'Olive Oil', 'Carrot', 'Bell Pepper'],
    time: 22,
    emoji: '🐟',
  },
  {
    id: '7',
    title: 'Potato Soup',
    ingredients: ['Potato', 'Onion', 'Butter', 'Milk', 'Garlic'],
    time: 35,
    emoji: '🥣',
  },
  {
    id: '8',
    title: 'Spinach Omelette',
    ingredients: ['Eggs', 'Spinach', 'Cheese', 'Butter'],
    time: 12,
    emoji: '🥚',
  },
];

type ScannedItem = { name: string; expiresHours: number };

// Step: 'scan' | 'results'
type Step = 'scan' | 'results';

export default function ScanPage() {
  const router = useRouter();
  const { addItem } = useKitchenStore();

  const [step, setStep] = useState<Step>('scan');
  const [inputValue, setInputValue] = useState('');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [matchedRecipes, setMatchedRecipes] = useState<typeof allRecipes>([]);
  const [selectedExpiry, setSelectedExpiry] = useState(168);
  const [isScanning, setIsScanning] = useState(false);

  const addIngredient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || scannedItems.find(i => i.name.toLowerCase() === trimmed.toLowerCase())) return;
    setScannedItems(prev => [...prev, { name: trimmed, expiresHours: selectedExpiry }]);
    setInputValue('');
  };

  const removeIngredient = (name: string) => {
    setScannedItems(prev => prev.filter(i => i.name !== name));
  };

  const filteredSuggestions = suggestions.filter(s =>
    !scannedItems.find(i => i.name.toLowerCase() === s.toLowerCase()) &&
    (inputValue === '' || s.toLowerCase().includes(inputValue.toLowerCase()))
  );

  const findRecipes = () => {
    if (scannedItems.length === 0) return;

    setIsScanning(true);
    setTimeout(() => {
      const userIngredients = scannedItems.map(i => i.name.toLowerCase());

      const scored = allRecipes.map(recipe => {
        const matched = recipe.ingredients.filter(ing =>
          userIngredients.some(u => u.includes(ing.toLowerCase()) || ing.toLowerCase().includes(u))
        );
        return { ...recipe, matchPct: Math.round((matched.length / recipe.ingredients.length) * 100), matched: matched.length };
      });

      const relevant = scored.filter(r => r.matchPct >= 40).sort((a, b) => b.matchPct - a.matchPct);

      // Save scanned items to pantry store
      scannedItems.forEach(item => {
        addItem({
          id: Date.now().toString() + Math.random(),
          name: item.name,
          qty: '1',
          expiresHours: item.expiresHours,
          category: 'Scanned',
        });
      });

      setMatchedRecipes(relevant);
      setIsScanning(false);
      setStep('results');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-oatmeal dark:bg-charcoal">

      {/* ── STEP 1: Scan / Input ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {step === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col min-h-screen"
          >
            {/* Hero Header */}
            <div className="relative bg-charcoal text-white pt-14 pb-10 px-6 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sage rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-terracotta rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-sage/30 rounded-lg flex items-center justify-center">
                    <Camera size={18} className="text-sage" />
                  </div>
                  <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">SavorAi Scanner</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black leading-tight mb-2">
                  What&apos;s in your<br />
                  <span className="text-sage">kitchen?</span>
                </h1>
                <p className="text-white/60 text-sm font-medium">Add your ingredients and we&apos;ll find the best recipes for you.</p>
              </div>
            </div>

            <div className="flex-1 px-6 py-6 max-w-2xl mx-auto w-full pb-32 md:pb-8">

              {/* Input Box */}
              <div className="bg-white dark:bg-charcoal/60 rounded-[24px] p-4 border border-mutedAsh/10 shadow-sm mb-6">
                <div className="flex gap-3 items-center mb-4">
                  <div className="flex-1 flex items-center gap-2 bg-oatmeal dark:bg-sage/10 rounded-2xl px-4 py-3">
                    <Search size={18} className="text-mutedAsh shrink-0" />
                    <input
                      type="text"
                      placeholder="Type an ingredient (e.g. Eggs)..."
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addIngredient(inputValue)}
                      className="flex-1 bg-transparent text-charcoal dark:text-oatmeal outline-none text-base font-medium placeholder:text-mutedAsh/60"
                    />
                  </div>
                  <button
                    onClick={() => addIngredient(inputValue)}
                    disabled={!inputValue.trim()}
                    className="w-12 h-12 bg-sage text-white rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-30 hover:bg-sage-dark transition-colors active:scale-95"
                  >
                    <Plus size={22} />
                  </button>
                </div>

                {/* Expiry Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-mutedAsh uppercase tracking-wider shrink-0">Freshness:</span>
                  <div className="flex overflow-x-auto gap-2 no-scrollbar">
                    {expiryOptions.map(opt => (
                      <button
                        key={opt.hours}
                        onClick={() => setSelectedExpiry(opt.hours)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                          selectedExpiry === opt.hours
                            ? 'bg-sage text-white'
                            : 'bg-oatmeal dark:bg-sage/10 text-mutedAsh hover:text-charcoal dark:hover:text-oatmeal'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestion Chips */}
              {filteredSuggestions.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-mutedAsh uppercase tracking-wider mb-3">Quick Add</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredSuggestions.slice(0, 12).map(s => (
                      <button
                        key={s}
                        onClick={() => addIngredient(s)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-charcoal/60 border border-mutedAsh/15 rounded-full text-sm font-semibold text-charcoal dark:text-oatmeal hover:border-sage hover:text-sage transition-all active:scale-95 shadow-sm"
                      >
                        <Plus size={14} /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Added Ingredients */}
              {scannedItems.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-charcoal dark:text-oatmeal">
                      Your Ingredients <span className="text-sage font-black ml-1">({scannedItems.length})</span>
                    </p>
                    <button
                      onClick={() => setScannedItems([])}
                      className="text-xs text-mutedAsh hover:text-terracotta font-semibold transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <motion.div layout className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {scannedItems.map(item => (
                        <motion.div
                          key={item.name}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2 px-4 py-2 bg-charcoal dark:bg-oatmeal text-white dark:text-charcoal rounded-full text-sm font-semibold shadow-md"
                        >
                          <CheckCircle2 size={14} className="text-sage dark:text-sage" />
                          {item.name}
                          <button onClick={() => removeIngredient(item.name)} className="opacity-60 hover:opacity-100 transition-opacity">
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}

              {/* Find Recipes CTA */}
              <div className="fixed bottom-16 md:bottom-6 left-0 right-0 px-6 z-40 max-w-2xl mx-auto">
                <motion.button
                  onClick={findRecipes}
                  disabled={scannedItems.length === 0 || isScanning}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-sage text-white rounded-[24px] font-black text-xl shadow-xl shadow-sage/30 disabled:opacity-40 transition-all relative overflow-hidden"
                >
                  {isScanning ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                        style={{ border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white' }}
                      />
                      Finding recipes…
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      Find Recipes ({scannedItems.length} items)
                      <ArrowRight size={24} />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Results ──────────────────────────────── */}
        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pb-24 md:pb-8"
          >
            {/* Header */}
            <div className="bg-charcoal text-white px-6 pt-14 pb-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sage rounded-full -translate-y-1/2 translate-x-1/2" />
              </div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <button
                  onClick={() => setStep('scan')}
                  className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-semibold mb-5 transition-colors"
                >
                  ← Back to ingredients
                </button>
                <h1 className="text-3xl font-black mb-1">
                  {matchedRecipes.length > 0 ? `${matchedRecipes.length} Recipes Found!` : 'No Matches Yet'}
                </h1>
                <p className="text-white/60 text-sm font-medium">
                  Based on {scannedItems.length} ingredient{scannedItems.length !== 1 ? 's' : ''}: {scannedItems.slice(0, 4).map(i => i.name).join(', ')}{scannedItems.length > 4 ? ` +${scannedItems.length - 4} more` : ''}
                </p>
              </div>
            </div>

            <div className="px-6 py-6 max-w-2xl mx-auto w-full">
              {matchedRecipes.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🥲</div>
                  <h2 className="text-2xl font-bold text-charcoal dark:text-oatmeal mb-2">No matching recipes</h2>
                  <p className="text-mutedAsh font-medium mb-6">Try adding more ingredients to find a match.</p>
                  <button
                    onClick={() => setStep('scan')}
                    className="px-8 py-3 bg-sage text-white rounded-2xl font-bold"
                  >
                    Add More Ingredients
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchedRecipes.map((recipe, i) => {
                    const userIngredients = scannedItems.map(s => s.name.toLowerCase());
                    const missing = recipe.ingredients.filter(
                      ing => !userIngredients.some(u => u.includes(ing.toLowerCase()) || ing.toLowerCase().includes(u))
                    );

                    return (
                      <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-charcoal/60 rounded-[28px] p-6 border border-mutedAsh/10 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-oatmeal dark:bg-sage/10 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                              {recipe.emoji}
                            </div>
                            <div>
                              <div className={`text-xs font-black px-2.5 py-1 rounded-lg mb-1.5 inline-block ${
                                recipe.matchPct === 100 ? 'bg-sage/10 text-sage' : 'bg-terracotta/10 text-terracotta'
                              }`}>
                                {recipe.matchPct}% Match
                              </div>
                              <h3 className="text-lg font-bold text-charcoal dark:text-oatmeal leading-tight">{recipe.title}</h3>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs text-mutedAsh font-semibold">{recipe.time} min</div>
                          </div>
                        </div>

                        {/* Ingredients breakdown */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {recipe.ingredients.map(ing => {
                            const owned = userIngredients.some(u => u.includes(ing.toLowerCase()) || ing.toLowerCase().includes(u));
                            return (
                              <span
                                key={ing}
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                  owned
                                    ? 'bg-sage/10 text-sage'
                                    : 'bg-mutedAsh/10 text-mutedAsh line-through'
                                }`}
                              >
                                {ing}
                              </span>
                            );
                          })}
                        </div>

                        {missing.length > 0 && (
                          <p className="text-xs text-mutedAsh font-medium mb-4">
                            Still need: <span className="font-bold text-terracotta">{missing.join(', ')}</span>
                          </p>
                        )}

                        <button
                          onClick={() => router.push(`/cook/${recipe.id}`)}
                          className="w-full flex items-center justify-center gap-2 py-3.5 bg-sage hover:bg-sage-dark text-white rounded-2xl font-bold transition-all active:scale-[0.98]"
                        >
                          Cook This <ArrowRight size={18} />
                        </button>
                      </motion.div>
                    );
                  })}

                  {/* Browse all recipes */}
                  <button
                    onClick={() => router.push('/recipes')}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-mutedAsh/20 text-mutedAsh hover:border-sage hover:text-sage rounded-2xl font-bold transition-all"
                  >
                    Browse All Recipes <ChevronDown size={18} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
