'use client';

import { useEffect } from 'react';

export function ThemeInitializer() {
  useEffect(() => {
    const savedColor = localStorage.getItem('theme-primary-color');
    if (savedColor) {
      const root = document.documentElement;
      root.style.setProperty('--primary', savedColor);
      root.style.setProperty('--accent', savedColor);
      root.style.setProperty('--ring', savedColor);
      root.style.setProperty('--color-primary', savedColor);
      root.style.setProperty('--color-accent', savedColor);
      root.style.setProperty('--color-ring', savedColor);
    }
  }, []);

  return null;
}
