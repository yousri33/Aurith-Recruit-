'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    WebsiteTracker?: any;
  }
}

export function AnalyticsProvider() {
  useEffect(() => {
    // Load analytics script
    const script = document.createElement('script');
    script.src = '/analytics-tracker.js';
    script.async = true;

    script.onload = () => {
      if (typeof window !== 'undefined' && window.WebsiteTracker) {
        window.WebsiteTracker.init({
          trackingUrl: '/api/track',
          website: 'aurith-recruit.com',
          enabled: true,
          trackPageView: true,
          debug: false
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}
