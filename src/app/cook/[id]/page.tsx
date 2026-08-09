'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Play, Pause, RotateCcw, Check, ChevronRight, AlertTriangle } from 'lucide-react';
import { useKitchenStore } from '@/store/useKitchenStore';

export default function CookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { recipes, markUsed } = useKitchenStore();
  const recipe = recipes.find(r => r.id === params.id) || recipes[0]; // fallback
  
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const totalSteps = recipe.steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
      // Reset timer for new step
      setTimeLeft(180);
      setIsTimerRunning(false);
    } else {
      // Complete recipe logic
      // In a real app we'd map recipe ingredients to inventory items and mark them used.
      // Here we just mark the first two mock items used to simulate it.
      markUsed('1'); 
      markUsed('2');
      router.push('/profile'); // go to profile to see updated stats
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-charcoal flex flex-col fixed inset-0 z-50">
      {/* Header */}
      <header className="px-6 py-4 border-b border-mutedAsh/20 flex items-center justify-between bg-white dark:bg-charcoal z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-oatmeal dark:hover:bg-sage/20 text-mutedAsh transition-colors"
          >
            <X size={24} />
          </button>
          <div className="font-semibold text-charcoal dark:text-oatmeal">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-sage/10 text-sage rounded-full text-xs font-bold uppercase tracking-wide">
          <Mic size={14} /> Voice On
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-oatmeal dark:bg-charcoal">
        <motion.div 
          className="h-full bg-sage"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center px-6 md:px-12 max-w-3xl mx-auto w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-8"
          >
            <h1 className="text-3xl md:text-5xl leading-tight font-medium text-charcoal dark:text-oatmeal tracking-tight">
              {recipe.steps[currentStep]}
            </h1>
            
            {/* Swap Callout Example (Show on step 2 randomly) */}
            {currentStep === 2 && recipe.missing.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cream/50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 flex gap-4 items-start"
              >
                <div className="text-amber-500 mt-0.5">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-amber-800 dark:text-amber-500 mb-1">Missing {recipe.missing[0]}?</h4>
                  <p className="text-amber-700/80 dark:text-amber-400/80 font-medium">Used Whole Milk + Butter blend instead of Heavy Cream in this step.</p>
                </div>
              </motion.div>
            )}
            
            {/* Timer Component */}
            <div className="bg-oatmeal dark:bg-sage/10 rounded-3xl p-6 flex flex-col items-center justify-center border border-mutedAsh/10 shadow-sm max-w-sm mx-auto mt-8">
              <div className="text-5xl md:text-6xl font-bold font-mono text-charcoal dark:text-oatmeal tracking-tighter mb-6">
                {formatTime(timeLeft)}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-charcoal border border-mutedAsh/20 rounded-full font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  {isTimerRunning ? <><Pause size={20} className="text-terracotta"/> Pause</> : <><Play size={20} className="text-sage" /> Start</>}
                </button>
                <button 
                  onClick={() => { setTimeLeft(180); setIsTimerRunning(false); }}
                  className="w-12 h-12 flex items-center justify-center bg-white dark:bg-charcoal border border-mutedAsh/20 rounded-full shadow-sm hover:bg-oatmeal dark:hover:bg-sage/20 transition-all active:scale-95 text-mutedAsh"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer CTA */}
      <footer className="p-6 md:p-8 border-t border-mutedAsh/20 bg-white/90 dark:bg-charcoal/90 backdrop-blur-md">
        <button 
          onClick={nextStep}
          className="w-full max-w-3xl mx-auto flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white py-5 rounded-2xl text-xl font-bold shadow-lg shadow-sage/30 transition-all active:scale-[0.98]"
        >
          {currentStep === totalSteps - 1 ? (
            <>Complete Recipe <Check size={24} /></>
          ) : (
            <>Next Step <ChevronRight size={24} /></>
          )}
        </button>
      </footer>
    </div>
  );
}
