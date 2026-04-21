import { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    atOptions?: unknown;
  }
}

export const AdBlockerDetector: React.FC = () => {
  const [detected, setDetected] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let signals = 0;

    const runChecks = async () => {
      // 1️⃣ BAIT ELEMENT TEST
      const bait = document.createElement('div');
      bait.className = 'adsbox ad-banner ad-container';
      bait.style.position = 'absolute';
      bait.style.height = '1px';
      bait.style.width = '1px';
      document.body.appendChild(bait);

      const baitHidden =
        bait.offsetHeight === 0 ||
        getComputedStyle(bait).display === 'none' ||
        getComputedStyle(bait).visibility === 'hidden';

      if (baitHidden) {
        signals++;
      }

      bait.remove();

      // 2️⃣ SCRIPT LOAD TEST
      try {
        await fetch(
          'https://tuxedoarbourannouncement.com/bf/93/6d/bf936dcbca5a547e4bb602e649b57d5a.js',
          { mode: 'no-cors' }
        );
      } catch {
        signals++;
      }

      // 3️⃣ NETWORK TEST
      try {
        await fetch(
          'https://tuxedoarbourannouncement.com/bf/93/6d/bf936dcbca5a547e4bb602e649b57d5a.js',
          { mode: 'no-cors' }
        );
      } catch {
        signals++;
      }

      // 4️⃣ GLOBAL VARIABLE TEST
      if (typeof window.atOptions === 'undefined') {
        signals++;
      }

      // 🎯 FINAL DECISION
      if (signals >= 2) {
        setDetected(true);
      }
    };

    const timer = setTimeout(runChecks, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!detected || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-500 to-orange-500 text-white">
      <div className="container-custom py-3 flex justify-between gap-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 mt-1" />
          <div>
            <p className="font-semibold">Ad Blocker Detected</p>
            <p className="text-sm">
              Please disable your ad blocker to support this free service.
            </p>
          </div>
        </div>
        <button onClick={() => setDismissed(true)}>
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};