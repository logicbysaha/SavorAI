'use client';

import { useState } from 'react';
import { useKitchenStore } from '@/store/useKitchenStore';
import { Plus, Minus, Check, Clock, PackagePlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PantryPage() {
  const { inventory, markUsed, addItem } = useKitchenStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  
  const expiringSoon = inventory.filter(item => item.expiresHours < 48);
  const freshItems = inventory.filter(item => item.expiresHours >= 48);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addItem({
        id: Date.now().toString(),
        name: newItemName,
        qty: '1',
        expiresHours: 168, // 1 week
        category: 'Other'
      });
      setNewItemName('');
      setIsAddModalOpen(false);
    }
  };

  const ItemRow = ({ item, isExpiring }: { item: any, isExpiring: boolean }) => (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0, border: 0 }}
      className="flex items-center gap-4 p-4 bg-white dark:bg-charcoal/50 rounded-[24px] border border-mutedAsh/10 shadow-sm mb-3 group"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isExpiring ? 'bg-terracotta/10 text-terracotta' : 'bg-sage/10 text-sage'}`}>
        {isExpiring ? <Clock size={24} /> : <div className="font-bold text-xl">{item.name.charAt(0)}</div>}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-charcoal dark:text-oatmeal truncate text-lg">{item.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          {isExpiring ? (
            <span className="px-2 py-0.5 rounded-md bg-terracotta/10 text-terracotta text-xs font-bold uppercase tracking-wider">Exp &lt;48h</span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-sage/10 text-sage text-xs font-bold uppercase tracking-wider">Fresh</span>
          )}
          <span className="text-mutedAsh text-sm font-medium">{item.category}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-oatmeal dark:bg-charcoal rounded-xl p-1 shrink-0">
        <button className="p-1.5 text-mutedAsh hover:bg-white dark:hover:bg-sage/20 rounded-lg"><Minus size={16}/></button>
        <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
        <button className="p-1.5 text-mutedAsh hover:bg-white dark:hover:bg-sage/20 rounded-lg"><Plus size={16}/></button>
      </div>

      <button 
        onClick={() => markUsed(item.id)}
        className="w-12 h-12 shrink-0 rounded-xl border-2 border-mutedAsh/20 flex items-center justify-center text-transparent hover:bg-sage hover:border-sage hover:text-white transition-all active:scale-95 group-hover:border-sage/40"
        title="Mark as used"
      >
        <Check size={20} className="stroke-[3]" />
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen p-6 pb-24 md:pb-6 md:p-8 max-w-4xl mx-auto relative">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-charcoal dark:text-oatmeal mb-2">My Pantry</h1>
        <p className="text-mutedAsh">{inventory.length} items total</p>
      </header>

      {/* Expiring Soon */}
      {expiringSoon.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-bold text-terracotta uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-terracotta"></div>
            Expiring Soon
          </h2>
          <AnimatePresence>
            {expiringSoon.map(item => <ItemRow key={item.id} item={item} isExpiring={true} />)}
          </AnimatePresence>
        </div>
      )}

      {/* Fresh & Stocked */}
      <div className="mb-24">
        <h2 className="text-sm font-bold text-sage uppercase tracking-widest mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sage"></div>
          Fresh & Stocked
        </h2>
        <AnimatePresence>
          {freshItems.map(item => <ItemRow key={item.id} item={item} isExpiring={false} />)}
        </AnimatePresence>
        
        {freshItems.length === 0 && expiringSoon.length === 0 && (
          <div className="text-center py-12 text-mutedAsh">Your pantry is empty. Scan some items!</div>
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-6 md:right-8 w-16 h-16 bg-charcoal dark:bg-oatmeal text-white dark:text-charcoal rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Plus size={32} className="stroke-[2.5]" />
      </button>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50 flex justify-center items-end md:items-center p-4 md:p-0"
              onClick={() => setIsAddModalOpen(false)}
            >
              <motion.div 
                initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-charcoal w-full max-w-md rounded-[32px] p-6 shadow-2xl relative"
              >
                <div className="absolute top-6 right-6">
                  <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-oatmeal dark:bg-sage/10 rounded-full text-mutedAsh">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="w-16 h-16 bg-sage/10 text-sage rounded-2xl flex items-center justify-center mb-6">
                  <PackagePlus size={32} />
                </div>
                
                <h2 className="text-2xl font-bold mb-6 text-charcoal dark:text-oatmeal">Add to Pantry</h2>
                
                <form onSubmit={handleAdd}>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-mutedAsh mb-2">Item Name</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="e.g. Fresh Basil"
                      className="w-full bg-oatmeal dark:bg-sage/10 border-0 rounded-2xl p-4 text-lg font-medium text-charcoal dark:text-oatmeal focus:ring-2 focus:ring-sage outline-none transition-all placeholder:text-mutedAsh/50"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-sage hover:bg-sage-dark text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50"
                    disabled={!newItemName.trim()}
                  >
                    Save Item
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
