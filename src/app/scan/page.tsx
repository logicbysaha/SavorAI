'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronUp, Camera, Plus, Minus, ArrowRight } from 'lucide-react';

const detectedItems = [
  { id: '1', name: 'Greek Yogurt', qty: 1, match: '98%', color: 'border-sage', text: 'text-sage', bg: 'bg-sage' },
  { id: '2', name: 'Heavy Cream', qty: 1, match: 'Exp 2d', color: 'border-terracotta', text: 'text-terracotta', bg: 'bg-terracotta' },
  { id: '3', name: 'Spinach', qty: 1, match: 'Exp Today', color: 'border-amber-500', text: 'text-amber-600', bg: 'bg-amber-500' },
  { id: '4', name: 'Eggs', qty: 12, match: '99%', color: 'border-sage', text: 'text-sage', bg: 'bg-sage' },
  { id: '5', name: 'Milk', qty: 1, match: '95%', color: 'border-sage', text: 'text-sage', bg: 'bg-sage' },
];

export default function ScanPage() {
  const [sheetOpen, setSheetOpen] = useState(true);
  const [items, setItems] = useState(detectedItems);

  const updateQty = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  return (
    <div className="relative h-screen w-full bg-charcoal overflow-hidden flex flex-col">
      {/* Fake Camera Viewport */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60 mix-blend-luminosity"></div>
      
      {/* AR Bounding Boxes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Greek Yogurt Box */}
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[20%] border-2 border-sage rounded-xl flex items-end p-2 animate-pulse">
          <div className="bg-sage text-white text-xs px-2 py-1 rounded-md font-medium shadow-md">
            Greek Yogurt (98%)
          </div>
        </div>
        
        {/* Heavy Cream Box */}
        <div className="absolute top-[55%] left-[50%] w-[20%] h-[25%] border-2 border-terracotta rounded-xl flex items-end p-2 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <div className="bg-terracotta text-white text-xs px-2 py-1 rounded-md font-medium shadow-md">
            Heavy Cream (Exp 2d)
          </div>
        </div>

        {/* Spinach Box */}
        <div className="absolute top-[20%] left-[60%] w-[25%] h-[15%] border-2 border-amber-500 rounded-xl flex items-end p-2 animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="bg-amber-500 text-white text-xs px-2 py-1 rounded-md font-medium shadow-md">
            Spinach (Exp Today)
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-charcoal/80 to-transparent">
        <h1 className="text-white font-semibold text-lg tracking-wide flex items-center gap-2">
          <Camera size={20} />
          Pantry Vision
        </h1>
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
      </div>

      {/* Bottom Sheet */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-charcoal rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-20"
        initial={{ y: "80%" }}
        animate={{ y: sheetOpen ? "0%" : "80%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.y > 50 || velocity.y > 500) {
            setSheetOpen(false);
          } else if (offset.y < -50 || velocity.y < -500) {
            setSheetOpen(true);
          }
        }}
      >
        <div className="p-6 pb-24 md:pb-6">
          <div 
            className="w-12 h-1.5 bg-mutedAsh/30 rounded-full mx-auto mb-6 cursor-pointer"
            onClick={() => setSheetOpen(!sheetOpen)}
          />
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">14 Items Detected</h2>
            <button 
              onClick={() => setSheetOpen(!sheetOpen)}
              className="p-2 rounded-full bg-oatmeal dark:bg-sage/20 text-charcoal dark:text-oatmeal md:hidden"
            >
              <ChevronUp className={`transition-transform duration-300 ${sheetOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Horizontal Scroller */}
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 snap-x no-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="min-w-[160px] snap-center bg-oatmeal dark:bg-sage/10 p-4 rounded-2xl border border-mutedAsh/10 shrink-0">
                <div className={`text-xs font-semibold mb-2 ${item.text}`}>{item.match}</div>
                <h3 className="font-medium text-charcoal dark:text-oatmeal mb-4 truncate">{item.name}</h3>
                
                <div className="flex items-center justify-between bg-white dark:bg-charcoal rounded-xl p-1 border border-mutedAsh/20">
                  <button 
                    onClick={() => updateQty(item.id, -1)}
                    className="p-1.5 rounded-lg hover:bg-oatmeal dark:hover:bg-sage/20 text-mutedAsh"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-medium w-8 text-center text-sm">{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item.id, 1)}
                    className="p-1.5 rounded-lg hover:bg-oatmeal dark:hover:bg-sage/20 text-mutedAsh"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-mutedAsh/20">
            <Link 
              href="/recipes"
              className="flex items-center justify-center gap-2 w-full bg-sage text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-sage/30 hover:bg-sage-dark transition-all active:scale-[0.98]"
            >
              Find Recipes <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
