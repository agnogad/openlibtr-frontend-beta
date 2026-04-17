'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Minus, Plus, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReaderSettingsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
}

export function ReaderSettings({ fontSize, setFontSize, fontFamily, setFontFamily }: ReaderSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const fontFamilies = [
    { name: 'Sans (Inter)', value: 'var(--font-sans)' },
    { name: 'Modern (Outfit)', value: 'var(--font-display)' },
    { name: 'Ergonomik (Lora)', value: 'var(--font-reading)' },
    { name: 'Monospace', value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
        title="Okuma Ayarları"
      >
        <Settings className="w-5 h-5 text-[#8E8E93] group-hover:text-primary transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-4 w-64 p-6 rounded-3xl glass shadow-2xl z-50 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black uppercase text-xs tracking-widest flex items-center gap-2">
                  <Type className="w-3.5 h-3.5 text-primary" />
                  Ayarlar
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-[#8E8E93] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">Yazı Boyutu</p>
                <div className="flex items-center justify-between bg-[#1c1c1e] rounded-xl p-1">
                  <button 
                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm">{fontSize}px</span>
                  <button 
                    onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">Yazı Tipi</p>
                <div className="grid grid-cols-1 gap-2">
                  {fontFamilies.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => setFontFamily(f.value)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left border ${
                        fontFamily === f.value 
                          ? 'bg-primary/10 border-primary text-primary' 
                          : 'bg-[#1c1c1e] border-transparent text-[#8E8E93] hover:text-white'
                      }`}
                      style={{ fontFamily: f.value }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
