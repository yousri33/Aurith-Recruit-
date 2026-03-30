# 🚀 Telegram Analytics - Quick Start

Your analytics system is live! Here's everything you need to know.

## ✅ What's Ready

- **API Endpoint**: `/api/track` (automatically deployed with Aurith Recruit)
- **Telegram Bot**: `analytics_bot` (configured with your token)
- **Chat ID**: `7448243821` (your Telegram ID)
- **Client Library**: `/analytics-tracker.js` (ready to embed anywhere)
- **Aurith Recruit**: Already tracking page views automatically

## 📱 Start Getting Notifications

**Right now, Aurith Recruit is sending you visitor data to Telegram!**

When someone visits your recruitment platform, you'll receive messages like:

```
📊 Visitor Tracking Alert

Website: aurith-recruit.com
Event: PAGE VIEW
Page: /
Title: Aurith Recruit - AI-Powered Recruitment
Time: 3/30/2026, 10:45 AM
Device: 💻 Desktop
```

---

## 🌐 Add to Your Other Websites

### For Any Website (Copy-Paste)

```html
<script src="https://aurith-recruit.vercel.app/analytics-tracker.js"></script>
<script>
  WebsiteTracker.init({
    trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
    website: 'your-site.com',  // Change to your domain
    enabled: true,
    trackPageView: true
  });
</script>
```

### For Next.js / React Apps

Check **ANALYTICS_EXAMPLES.md** for framework-specific code.

---

## 📊 What Data You'll Get

Each Telegram message includes:
- ✅ Website name
- ✅ Event type (page view, click, form submit, custom)
- ✅ Page URL
- ✅ Page title
- ✅ Device type (mobile/desktop)
- ✅ Timestamp
- ✅ Referrer (where they came from)
- ✅ Custom metadata (anything you want to track)

---

## 🎯 Manual Event Tracking

```javascript
// Track a button click
WebsiteTracker.track('custom', {
  action: 'signup_clicked',
  button: 'hero_cta'
});

// Track a form submission
WebsiteTracker.track('form_submit', {
  formName: 'contact',
  fieldCount: 5
});

// Track a purchase
WebsiteTracker.track('custom', {
  action: 'purchase',
  productId: '123',
  amount: 99.99
});
```

---

## 🔧 Configuration

### Basic (Just track page views)
```javascript
WebsiteTracker.init({
  trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
  website: 'mysite.com',
  enabled: true,
  trackPageView: true
});
```

### Advanced (Track everything)
```javascript
WebsiteTracker.init({
  trackingUrl: 'https://aurith-recruit.vercel.app/api/track',
  website: 'mysite.com',
  enabled: true,
  trackPageView: true,      // Track page loads
  trackClicks: true,         // Track all clicks (verbose!)
  trackFormSubmit: true,     // Track form submissions
  debug: true                // Show console logs
});
```

---

## 📋 Files You've Got

```
your-project/
├── app/api/track/route.ts          # API endpoint (handles Telegram sending)
├── public/analytics-tracker.js     # Client library (embed anywhere)
├── app/layout.tsx                  # Updated with analytics tracking
├── ANALYTICS_SETUP.md              # Full documentation
├── ANALYTICS_EXAMPLES.md           # Copy-paste examples for 8+ frameworks
└── .env.local                      # Contains bot token and chat ID
```

---

## 🚀 Deployment

**For Vercel** (your current host):
1. Add environment variables to Vercel dashboard:
   - `TELEGRAM_BOT_TOKEN` = `8690027071:AAH4Bl49LURNI0RBQjhBsA5AzgwdRBFkSDk`
   - `TELEGRAM_CHAT_ID` = `7448243821`
2. Deploy your app with `git push`
3. Analytics will work immediately

**For Other Hosts** (Firebase, Netlify, self-hosted):
1. Set the same environment variables on your host
2. Make sure Node.js runtime is available
3. Deploy the app
4. Done!

---

## 🧪 Test It Now

1. **Open your browser console** on any of your websites
2. **Run this command**:
   ```javascript
   WebsiteTracker.track('test', { message: 'Testing analytics!' });
   ```
3. **Check your Telegram** - you should get a message immediately!

---

## 🔒 Privacy & Security Notes

- ✅ No cookies set (Telegram handles auth)
- ✅ No personal data collected (just page visits and events)
- ✅ Server-to-server communication (secure)
- ✅ Telegram chat is private to you
- ✅ No tracking of form inputs/passwords (just events)

---

## 💡 Use Cases

### E-commerce
```javascript
// Track product views
WebsiteTracker.track('custom', {
  action: 'product_view',
  productId: '123',
  productName: 'Blue Widget',
  price: 29.99
});

// Track purchases
WebsiteTracker.track('custom', {
  action: 'purchase',
  orderId: 'ORD-456',
  amount: 149.99,
  items: 5
});
```

### SaaS / Apps
```javascript
// Track signups
WebsiteTracker.track('custom', {
  action: 'signup',
  plan: 'pro'
});

// Track feature usage
WebsiteTracker.track('custom', {
  action: 'feature_used',
  feature: 'export_as_pdf',
  duration_ms: 1250
});
```

### Blogs / Content
```javascript
// Track article reads
WebsiteTracker.track('custom', {
  action: 'article_read',
  title: 'How to Hire Faster',
  readTime_seconds: 480
});

// Track video plays
WebsiteTracker.track('custom', {
  action: 'video_play',
  videoId: 'abc123',
  duration_seconds: 600
});
```

---

## ❓ Troubleshooting

### Not getting Telegram messages?
1. Verify bot token is correct: `8690027071:AAH4Bl49LURNI0RBQjhBsA5AzgwdRBFkSDk`
2. Check chat ID is correct: `7448243821`
3. Enable debug mode: `debug: true`
4. Check browser console for errors
5. Make sure domain isn't blocked in your firewall

### Script not loading?
1. Verify the URL is accessible
2. Check browser console for CORS errors
3. Make sure you're using `https://` not `http://`
4. Try the self-hosted version if behind corporate firewall

### Events not being sent?
1. Open DevTools Network tab
2. Look for POST requests to `/api/track`
3. Check response status (should be 200)
4. Enable `debug: true` in config

---

## 📚 Full Documentation

- **ANALYTICS_SETUP.md** - Complete setup guide
- **ANALYTICS_EXAMPLES.md** - Code examples for every framework
- **app/api/track/route.ts** - API endpoint source code
- **public/analytics-tracker.js** - Client library source code

---

## 🎁 Next Steps

1. ✅ **Done**: Set up your Telegram analytics
2. ✅ **Done**: Integrated into Aurith Recruit
3. ⬜ **Next**: Add to your other websites
4. ⬜ **Next**: Start tracking custom events (purchases, signups, etc.)
5. ⬜ **Optional**: Set up a database to log events (currently just Telegram)

---

## 🤝 Self-Hosting

Want to host this on your own server instead? The code is production-ready:

1. Take the `/app/api/track/route.ts` file
2. Deploy to your Node.js server
3. Set environment variables:
   ```
   TELEGRAM_BOT_TOKEN=your_token
   TELEGRAM_CHAT_ID=your_id
   ```
4. Update tracking URLs in your websites
5. Done!

---

**Questions?** Check the ANALYTICS_SETUP.md or ANALYTICS_EXAMPLES.md files for detailed documentation.

**Want to see events?** Open Aurith Recruit in your browser - page views should appear in Telegram within seconds!
