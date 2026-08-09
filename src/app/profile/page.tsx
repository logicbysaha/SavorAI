'use client';

import { useState } from 'react';
import { useKitchenStore } from '@/store/useKitchenStore';
import { Leaf, DollarSign, Utensils, Heart, Settings, Bell, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const tags = ['Vegetarian', 'Nut-Free', 'High Protein', 'Under 30m'];

const favorites = [
  { id: '1', title: 'Creamy Tuscan Pasta', img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=400', time: '18m', category: 'Vegetarian' },
  { id: '2', title: 'Wild Mushroom Risotto', img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=400', time: '30m', category: 'Vegetarian' },
  { id: '3', title: 'Honey Garlic Salmon', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400', time: '25m', category: 'High Protein' },
  { id: '4', title: 'Spicy Peanut Noodles', img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400', time: '15m', category: 'Nut-Free' }
];

export default function ProfilePage() {
  const { stats } = useKitchenStore();
  const [activeTag, setActiveTag] = useState('All');

  return (
    <div className="min-h-screen p-6 pb-24 md:pb-6 md:p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center overflow-hidden border-2 border-sage p-0.5">
            <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-charcoal dark:text-oatmeal">Hi, Jamie!</h1>
            <p className="text-mutedAsh font-medium">Kitchen Hero Level 4</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-white dark:bg-charcoal rounded-full border border-mutedAsh/20 shadow-sm text-charcoal dark:text-oatmeal">
            <Bell size={20} />
          </button>
          <button className="p-2.5 bg-white dark:bg-charcoal rounded-full border border-mutedAsh/20 shadow-sm text-charcoal dark:text-oatmeal">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <h2 className="text-lg font-bold text-charcoal dark:text-oatmeal mb-4">Your Impact</h2>
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-charcoal/80 rounded-[24px] p-4 md:p-6 border border-mutedAsh/10 shadow-sm flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 bg-sage/10 text-sage rounded-xl flex items-center justify-center mb-3">
            <Utensils size={20} />
          </div>
          <div className="text-2xl md:text-3xl font-black text-charcoal dark:text-oatmeal mb-1">{stats.mealsSaved}</div>
          <div className="text-xs md:text-sm font-semibold text-mutedAsh">Meals Saved</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-charcoal/80 rounded-[24px] p-4 md:p-6 border border-mutedAsh/10 shadow-sm flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center mb-3">
            <DollarSign size={20} />
          </div>
          <div className="text-2xl md:text-3xl font-black text-charcoal dark:text-oatmeal mb-1">${stats.moneySaved.toFixed(2)}</div>
          <div className="text-xs md:text-sm font-semibold text-mutedAsh">Money Saved</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-charcoal/80 rounded-[24px] p-4 md:p-6 border border-mutedAsh/10 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-sage/5" />
          <div className="w-10 h-10 bg-sage/20 text-sage rounded-xl flex items-center justify-center mb-3 relative z-10">
            <Leaf size={20} />
          </div>
          <div className="text-2xl md:text-3xl font-black text-charcoal dark:text-oatmeal mb-1 relative z-10">{stats.co2Saved}kg</div>
          <div className="text-xs md:text-sm font-semibold text-sage relative z-10">CO₂ Averted</div>
        </motion.div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-charcoal dark:text-oatmeal">Favorites</h2>
        <button className="text-sage font-semibold text-sm flex items-center">
          See all <ChevronRight size={16} />
        </button>
      </div>

      {/* Interactive Tags */}
      <div className="flex overflow-x-auto gap-2 pb-4 -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar mb-4">
        <button
          onClick={() => setActiveTag('All')}
          className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
            activeTag === 'All' ? 'bg-charcoal text-white dark:bg-oatmeal dark:text-charcoal' : 'bg-white dark:bg-charcoal text-mutedAsh border border-mutedAsh/20'
          }`}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeTag === tag ? 'bg-charcoal text-white dark:bg-oatmeal dark:text-charcoal' : 'bg-white dark:bg-charcoal text-mutedAsh border border-mutedAsh/20'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Masonry Grid (simulated with CSS columns) */}
      <div className="columns-2 gap-4 space-y-4">
        {favorites.map((fav, i) => (
          <div 
            key={fav.id} 
            className="break-inside-avoid relative rounded-[24px] overflow-hidden group shadow-sm bg-white dark:bg-charcoal"
            style={{ opacity: activeTag === 'All' || activeTag === fav.category ? 1 : 0.4 }}
          >
            <div className={`aspect-[${i % 2 === 0 ? '4/5' : '1/1'}] relative w-full`}>
              <img src={fav.img} alt={fav.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-terracotta transition-colors">
                <Heart size={16} className="fill-current" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-white">
                    {fav.time}
                  </span>
                </div>
                <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                  {fav.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
