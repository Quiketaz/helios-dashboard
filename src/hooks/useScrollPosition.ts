import { useLayoutEffect } from 'react';

export const useScrollPosition = (storageKey: string) => {
  useLayoutEffect(() => {
    const savedPosition = sessionStorage.getItem(storageKey);
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }

    return () => {
      sessionStorage.setItem(storageKey, window.scrollY.toString());
    };
  }, [storageKey]);
};