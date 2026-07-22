import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const savedPositions = new Map();

/**
 * Mimic native browser scroll behavior in the SPA:
 * - PUSH/REPLACE (new link): scroll to top
 * - POP (back/forward): restore the previous scroll position
 */
export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const historyKey = location.key;

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (navigationType === 'POP') {
      const y = savedPositions.get(historyKey) ?? 0;
      window.scrollTo({ top: y, left: 0, behavior: 'auto' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    return () => {
      savedPositions.set(historyKey, window.scrollY);
    };
  }, [historyKey, navigationType]);

  return null;
}
