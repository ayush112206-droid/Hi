'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, X, Chrome } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export function SecurityWrapper({ children }: { children: React.ReactNode }) {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [isChrome, setIsChrome] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 0. Check Chrome
    const checkChrome = () => {
      if (typeof window === 'undefined' || !window.navigator) return;
      const userAgent = window.navigator.userAgent;
      const isChromeBrowser = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
      if (!isChromeBrowser) {
        setIsChrome(false);
      }
    };
    // Use setTimeout to avoid synchronous state updates in effect
    setTimeout(checkChrome, 0);

    // 0.5 Check Verification
    const checkVerification = () => {
      if (typeof window === 'undefined') return;
      try {
        const verifiedUntil = localStorage.getItem('verifiedUntil');
        const now = Date.now();
        if (verifiedUntil && parseInt(verifiedUntil, 10) > now) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
          // Redirect to home if not verified and not on home page or verify page
          if (pathname !== '/' && !pathname.startsWith('/verify/')) {
            router.push('/');
          }
        }
      } catch (e) {
        setIsVerified(false);
        if (pathname !== '/' && !pathname.startsWith('/verify/')) {
          router.push('/');
        }
      }
    };
    setTimeout(checkVerification, 0);

    // 0.7 Anti-Iframe Check (allow AI Studio preview)
    if (typeof window !== 'undefined' && window.top && window.top !== window.self) {
      if (!window.location.hostname.includes('run.app') && 
          !window.location.hostname.includes('localhost') &&
          !window.location.hostname.includes('vercel.app') &&
          !window.location.hostname.includes('personal.com')) {
        window.top.location.href = window.self.location.href;
      }
    }

    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable DevTools Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    // 3. DevTools Detection
    const detectDevTools = () => {
      if (typeof window === 'undefined') return;
      // Disable in preview environment to avoid false positives in the iframe
      if (window.location.hostname.includes('run.app') || 
          window.location.hostname.includes('localhost') ||
          window.location.hostname.includes('vercel.app') ||
          window.location.hostname.includes('personal.com')) {
        return;
      }
      
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      
      if (widthDiff || heightDiff) {
        setIsDevToolsOpen(true);
      } else {
        setIsDevToolsOpen(false);
      }
    };

    // 4. Fake API Noise Generator
    const generateNoise = () => {
      if (typeof window === 'undefined') return null;
      // Disable noise during build/SSR or if not in production
      if (process.env.NODE_ENV !== 'production' || window.location.hostname.includes('localhost')) {
        return null;
      }

      const fakeEndpoints = [
        '/api/v1/security/heartbeat',
        '/api/v2/telemetry/sync',
        '/api/v1/auth/verify-token',
        '/api/v3/analytics/event',
        '/api/v1/cache/refresh',
        '/api/v2/logs/push',
        '/api/v1/system/status',
        '/api/v1/user/session/validate',
        '/api/v1/security/integrity-check',
        '/api/v2/network/latency-test'
      ];

      // Fetch Interceptor for Fake Responses
      try {
        const originalFetch = window.fetch;
        
        // Try direct assignment first
        try {
          // @ts-ignore
          window.fetch = originalFetch;
        } catch (e) {
          // If direct assignment fails, try defineProperty
          Object.defineProperty(window, 'fetch', {
            value: originalFetch,
            configurable: true,
            writable: true
          });
        }
      } catch (error) {
        console.warn('Security: Fetch interception disabled due to environment restrictions.');
      }
      
      const sendFakeRequest = () => {
        const endpoint = fakeEndpoints[Math.floor(Math.random() * fakeEndpoints.length)];
        const payload = {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          status: 'success',
          encrypted_data: btoa(Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)),
          integrity_hash: btoa(Math.random().toString(36))
        };

        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Security-Token': btoa(Date.now().toString()),
            'X-Request-ID': Math.random().toString(36).substring(2),
            'X-Integrity-Check': 'verified'
          },
          body: JSON.stringify(payload)
        }).catch(() => {});
      };

      // Initial noise burst
      for(let i = 0; i < 5; i++) setTimeout(sendFakeRequest, Math.random() * 3000);

      // Periodic noise
      const interval = setInterval(sendFakeRequest, 3000 + Math.random() * 5000);
      return interval;
    };

    // 5. Console Obfuscation
    const obfuscateConsole = () => {
      if (typeof window === 'undefined') return;
      const noop = () => {};
      // @ts-ignore
      if (process.env.NODE_ENV === 'production' && !window.location.hostname.includes('localhost')) {
        console.log = noop;
        console.info = noop;
        console.warn = noop;
        console.error = noop;
        console.debug = noop;
      }
      
      // Periodic clear
      setInterval(() => {
        console.clear();
      }, 1000);
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', detectDevTools);
    
    const noiseInterval = generateNoise();
    obfuscateConsole();

    // Check periodically for devtools
    const checkInterval = setInterval(detectDevTools, 2000);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', detectDevTools);
      if (noiseInterval) clearInterval(noiseInterval);
      clearInterval(checkInterval);
    };
  }, [pathname, router]);

  if (!isChrome) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 mb-6 animate-pulse">
          <Chrome className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Browser Not Supported</h1>
        <p className="text-white/60 max-w-md leading-relaxed mb-8">
          You are opening in a non-Chrome browser. For security reasons, VIP Study only runs in Google Chrome. Please open this link in Chrome.
        </p>
      </div>
    );
  }

  // Prevent rendering anything if devtools are open to hide view source
  if (isDevToolsOpen) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center p-6 text-center">
        {/* Completely black mode as requested */}
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}
