'use client';

import { useEffect, useState } from 'react';

export default function ThemeInitializer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set the theme based on localStorage or system preference
    const setInitialTheme = () => {
      try {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const theme = storedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-bs-theme', theme);
      } catch (error) {
        console.error('Error initializing theme:', error);
      } finally {
        setMounted(true);
      }
    };

    setInitialTheme();
  }, []);

  // Don't render anything, just initialize the theme
  return null;
}
