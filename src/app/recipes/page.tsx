'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Leaf, AlertCircle, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { useKitchenStore } from '@/store/useKitchenStore';

const filters = ['100% Match', '1-2 Swaps', '< 20 Min', 'High Protein', 'Vegetarian'];

export default function RecipesPage() {
  const [activeFilters, setActiveFilters] = useState(['100% Match']);
  const [prioritizeExpiring, setPrioritizeExpiring] = useState(true);
  const recipes = useKitchenStore(state => state.recipes);

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24 md:pb-6 md:p-8 max-w-5xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-charcoal dark:text-oatmeal mb-2">What to cook</h1>
          <p className="text-mutedAsh">Based on your pantry</p>
        </div>
        <button className="p-3 bg-white dark:bg-charcoal rounded-full border border-mutedAsh/20 shadow-sm">
          <Filter size={20} className="text-charcoal dark:text-oatmeal" />
        </button>
      </header>

      {/* Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-terracotta/10 border border-terracotta/20 rounded-3xl p-5 mb-8 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="bg-terracotta text-white p-3 rounded-2xl shadow-inner">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-terracotta dark:text-terracotta-light text-lg">3 items expire &lt;48h</h3>
            <p className="text-sm text-terracotta/80 dark:text-terracotta-light/80">Let's use them up!</p>
          </div>
        </div>
        
        {/* Custom Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium hidden md:block text-terracotta">Prioritize</span>
          <button 
            onClick={() => setPrioritizeExpiring(!prioritizeExpiring)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${prioritizeExpiring ? 'bg-terracotta' : 'bg-mutedAsh/30'}`}
          >
            <motion.div 
              className="w-6 h-6 bg-white rounded-full shadow-md"
              animate={{ x: prioritizeExpiring ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </motion.div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto gap-3 pb-4 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar mb-6">
        {filters.map(filter => {
          const isActive = activeFilters.includes(filter);
          return (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${
                isActive 
                  ? 'bg-charcoal text-white border-charcoal dark:bg-oatmeal dark:text-charcoal dark:border-oatmeal shadow-md' 
                  : 'bg-white text-mutedAsh border-mutedAsh/20 hover:border-mutedAsh/40 dark:bg-charcoal/50 dark:text-mutedAsh dark:border-mutedAsh/20'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Recipe Cards */}
      <div className="space-y-6">
        {recipes.map((recipe, index) => {
          const isPerfectMatch = recipe.matchPct === 100;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={recipe.id}
            >
              <Link href={`/cook/${recipe.id}`} className="block group">
                <div className="bg-white dark:bg-charcoal/80 rounded-[32px] p-6 border border-mutedAsh/10 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  
                  {/* Decorative Background Blob */}
                  {isPerfectMatch && (
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-sage/5 rounded-full blur-3xl pointer-events-none group-hover:bg-sage/10 transition-colors"></div>
                  )}

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        isPerfectMatch ? 'bg-sage/10 text-sage' : 'bg-terracotta/10 text-terracotta'
                      }`}>
                        {recipe.matchPct}% Match
                      </div>
                      {recipe.savesExpiringCount > 0 && (
                        <div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 px-3 py-1.5 rounded-lg">
                          <Leaf size={14} />
                          Saves {recipe.savesExpiringCount} expiring
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-oatmeal dark:bg-charcoal rounded-full text-charcoal dark:text-oatmeal group-hover:bg-sage group-hover:text-white transition-colors">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-charcoal dark:text-oatmeal mb-3 group-hover:text-sage transition-colors relative z-10">
                    {recipe.title}
                  </h2>
                  
                  <div className="flex items-center gap-6 text-sm text-mutedAsh mb-5 relative z-10">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={16} />
                      {recipe.time} min
                    </div>
                    {isPerfectMatch ? (
                      <div className="flex items-center gap-1.5 text-sage font-medium">
                        <Sparkles size={16} />
                        You have everything
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-terracotta font-medium">
                        <AlertCircle size={16} />
                        Missing {recipe.missing.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
