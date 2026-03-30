# Website Visitor Analytics via Telegram

Track visitors across all your websites and receive instant Telegram notifications.

## ✅ Configuration Complete

Your analytics system is set up with:
- **API Endpoint**: `/api/track`
- **Bot Token**: `analytics_bot` (8690027071:AAH...)
- **Chat ID**: 7448243821 (your Telegram ID)
- **Client Library**: `/public/analytics-tracker.js`

## 🚀 Quick Start

### For Aurith Recruit (Already Integrated)

Add this to your main layout or page:

```html
<script src="/analytics-tracker.js"></script>
<script>
  WebsiteTracker.init({
    trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
    website: 'aurith-recruit.com',
    enabled: true,
    trackPageView: true,
    trackClicks: false,
    trackFormSubmit: false,
    debug: false
  });
</script>
```

---

## 📱 For Other Websites

### Option 1: Static HTML Sites

Add to your `<head>` or before closing `</body>`:

```html
<script src="https://aurith-recruit.vercel.app/analytics-tracker.js"></script>
<script>
  WebsiteTracker.init({
    trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
    website: 'your-site.com',  // Change to your domain
    enabled: true,
    trackPageView: true,
    trackClicks: false,
    trackFormSubmit: false
  });
</script>
```

### Option 2: Next.js Sites

Create `app/layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.WebsiteTracker = (...); // paste the tracker code
              WebsiteTracker.init({
                trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
                website: 'your-site.com',
                enabled: true,
                trackPageView: true
              });
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Option 3: React Apps (Create React App / Vite)

Create `src/hooks/useAnalytics.ts`:

```typescript
import { useEffect } from 'react';

export function useAnalytics(websiteName: string) {
  useEffect(() => {
    // Load tracker script
    const script = document.createElement('script');
    script.src = 'https://aurith-recruit.vercel.app/analytics-tracker.js';
    script.async = true;
    script.onload = () => {
      if (window.WebsiteTracker) {
        window.WebsiteTracker.init({
          trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
          website: websiteName,
          enabled: true,
          trackPageView: true
        });
      }
    };
    document.head.appendChild(script);
  }, [websiteName]);
}
```

Then in your `App.tsx`:

```tsx
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  useAnalytics('my-react-app.com');

  return (
    // your app
  );
}
```

### Option 4: WordPress

Add to `functions.php` in your theme:

```php
<?php
function add_analytics_tracker() {
  ?>
  <script src="https://aurith-recruit.vercel.app/analytics-tracker.js"></script>
  <script>
    WebsiteTracker.init({
      trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
      website: '<?php echo get_bloginfo("url"); ?>',
      enabled: true,
      trackPageView: true
    });
  </script>
  <?php
}
add_action('wp_footer', 'add_analytics_tracker');
```

---

## ⚙️ Configuration Options

```javascript
WebsiteTracker.init({
  trackingUrl: 'https://your-api.com/api/track',    // Required: Your API endpoint
  website: 'example.com',                             // Required: Your website name
  enabled: true,                                      // Enable/disable tracking
  trackPageView: true,                                // Track page loads (default: true)
  trackClicks: false,                                 // Track all clicks (default: false)
  trackFormSubmit: false,                             // Track form submissions (default: false)
  debug: false                                        // Show console logs (default: false)
});
```

---

## 🎯 Manual Event Tracking

Track custom events:

```javascript
// When user performs an action
WebsiteTracker.track('custom', {
  action: 'button_clicked',
  buttonName: 'Sign Up',
  location: 'homepage_hero'
});

// Or any other event
WebsiteTracker.track('form_submit', {
  formName: 'contact_form',
  fieldCount: 5
});
```

---

## 📊 What Gets Tracked

Each event includes:
- **Website**: Name you provided
- **Event Type**: page_view, click, form_submit, or custom
- **Page URL**: Current page path
- **Page Title**: Document title
- **Referrer**: Where visitor came from
- **Device**: Mobile or Desktop (from user agent)
- **Timestamp**: Exact time of event
- **Custom Metadata**: Any data you include

Example Telegram message:
```
📊 Visitor Tracking Alert

Website: aurith-recruit.com
Event: PAGE VIEW
Page: /dashboard
Title: Aurith Recruit - AI Screening
Time: 3/30/2026, 10:45 AM
Device: 💻 Desktop
```

---

## 🔒 Privacy & Security

- ✅ No cookies (except Telegram session auth)
- ✅ No personal data collected
- ✅ Only pagviews and events tracked
- ✅ Events sent server-to-server
- ✅ Telegram chat is private to you

---

## 🚫 Disable Tracking

To temporarily disable tracking:

```javascript
WebsiteTracker.setEnabled(false);
```

---

## 🐛 Debugging

Enable debug mode to see console logs:

```javascript
WebsiteTracker.init({
  trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
  website: 'test.com',
  enabled: true,
  debug: true  // Shows [WebsiteTracker] logs in console
});
```

---

## 📋 Multiple Websites

Just add the tracker to each website with a different `website` value:

```javascript
// Website 1
WebsiteTracker.init({
  trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
  website: 'site1.com',
  enabled: true
});

// Website 2 (separate installation)
WebsiteTracker.init({
  trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
  website: 'site2.com',
  enabled: true
});
```

All events are grouped by website name in your Telegram messages.

---

## 🔄 Self-Hosting

To self-host the API:

1. Clone/fork your Aurith Recruit repo
2. Deploy to your own server
3. Set environment variables:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_chat_id
   ```
4. Update tracking URLs in your websites to point to your domain

---

## ⚡ API Endpoint Reference

**POST** `/api/track`

Request body:
```json
{
  "event": "page_view",
  "website": "example.com",
  "page": "/",
  "title": "Home",
  "referrer": "google.com",
  "userAgent": "Mozilla/5.0...",
  "metadata": {
    "custom": "data"
  }
}
```

Response:
```json
{
  "success": true,
  "event": { /* your event data */ }
}
```

---

## 💡 Tips

- **Batch events**: For high-traffic sites, consider batching multiple events before sending
- **Rate limiting**: The API currently sends all events. Consider adding debouncing for high-frequency tracking
- **Custom metadata**: Use metadata to track form field names, button names, feature flags, etc.
- **A/B testing**: Track which variant was shown using metadata

---

Need help? Check the debug console or review the `analytics-tracker.js` source code.
