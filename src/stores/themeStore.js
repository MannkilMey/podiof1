import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      }))
    }),
    {
      name: 'podiof1-theme',
    }
  )
);

// Mantiene <html data-theme="..."> sincronizado con el store en todo momento —
// así el fondo de seguridad de index.html siempre coincide con el tema real,
// sin que ninguna pantalla particular tenga que ocuparse de esto.
useThemeStore.subscribe((state) => {
  document.documentElement.setAttribute('data-theme', state.theme);
});
document.documentElement.setAttribute('data-theme', useThemeStore.getState().theme);