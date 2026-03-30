# 📨 All Kinds of Telegram Messages

Here are ALL the different message formats your analytics system sends.

---

## 1️⃣ Page View (Default)

**When**: Someone visits your website
**Code**: Automatic (no code needed)
**Message**:
```
📊 Visitor Tracking Alert

Website: aurith-recruit.com
Event: PAGE VIEW
Page: /
Title: Aurith Recruit - AI-Powered Recruitment
Time: 3/30/2026, 10:45 AM
Referrer: google.com
Device: 💻 Desktop
```

**Advanced Page View** (with metadata):
```javascript
WebsiteTracker.track('page_view', {
  section: 'pricing',
  variant: 'ab_test_v2'
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: mysite.com
Event: PAGE VIEW
Page: /pricing
Title: Pricing Plans
Time: 3/30/2026, 2:15 PM
Device: 💻 Desktop

Details:
  • section: pricing
  • variant: ab_test_v2
```

---

## 2️⃣ Click Events

**When**: User clicks a button or link
**Code**:
```javascript
document.getElementById('signup-btn').addEventListener('click', () => {
  WebsiteTracker.track('click', {
    buttonId: 'signup-btn',
    buttonText: 'Get Started Now',
    location: 'hero_section'
  });
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: mysite.com
Event: CLICK
Page: /
Title: Home
Time: 3/30/2026, 10:50 AM
Device: 📱 Mobile

Details:
  • buttonId: signup-btn
  • buttonText: Get Started Now
  • location: hero_section
```

---

## 3️⃣ Form Submission

**When**: User submits a form
**Code**:
```javascript
document.getElementById('contact-form').addEventListener('submit', (e) => {
  WebsiteTracker.track('form_submit', {
    formId: 'contact-form',
    formName: 'Contact Us',
    fieldCount: 4,
    email: 'masked'  // Never send real data!
  });
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: mysite.com
Event: FORM SUBMIT
Page: /contact
Title: Contact Us
Time: 3/30/2026, 11:00 AM
Device: 💻 Desktop

Details:
  • formId: contact-form
  • formName: Contact Us
  • fieldCount: 4
  • email: masked
```

---

## 4️⃣ Custom Events - Sign Up

**Code**:
```javascript
// When user completes signup
WebsiteTracker.track('custom', {
  action: 'signup',
  plan: 'Pro',
  source: 'referral_link'
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: mysite.com
Event: CUSTOM
Page: /register
Title: Create Account
Time: 3/30/2026, 11:15 AM
Device: 💻 Desktop

Details:
  • action: signup
  • plan: Pro
  • source: referral_link
```

---

## 5️⃣ Custom Events - Login

**Code**:
```javascript
// After user logs in
WebsiteTracker.track('custom', {
  action: 'login',
  method: 'google_oauth',
  previousUser: false
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: aurith-recruit.com
Event: CUSTOM
Page: /auth/callback
Title: Redirecting...
Time: 3/30/2026, 11:20 AM
Device: 💻 Desktop

Details:
  • action: login
  • method: google_oauth
  • previousUser: false
```

---

## 6️⃣ Custom Events - Purchase

**Code**:
```javascript
// After successful payment
WebsiteTracker.track('custom', {
  action: 'purchase',
  orderId: 'ORD-123456',
  amount: 99.99,
  currency: 'USD',
  itemCount: 3,
  paymentMethod: 'credit_card'
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: shop.example.com
Event: CUSTOM
Page: /checkout/success
Title: Order Confirmed
Time: 3/30/2026, 12:00 PM
Device: 💻 Desktop

Details:
  • action: purchase
  • orderId: ORD-123456
  • amount: 99.99
  • currency: USD
  • itemCount: 3
  • paymentMethod: credit_card
```

---

## 7️⃣ Custom Events - Feature Usage

**Code**:
```javascript
// When user uses a feature
WebsiteTracker.track('custom', {
  action: 'feature_used',
  feature: 'export_csv',
  itemCount: 250,
  duration_ms: 1500
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: app.example.com
Event: CUSTOM
Page: /dashboard
Title: Dashboard
Time: 3/30/2026, 1:30 PM
Device: 💻 Desktop

Details:
  • action: feature_used
  • feature: export_csv
  • itemCount: 250
  • duration_ms: 1500
```

---

## 8️⃣ Custom Events - Video View

**Code**:
```javascript
// When user plays a video
WebsiteTracker.track('custom', {
  action: 'video_play',
  videoId: 'abc123',
  videoTitle: 'How to Hire Faster',
  duration_seconds: 600,
  autoplay: false
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: blog.example.com
Event: CUSTOM
Page: /tutorial/hiring
Title: Tutorial: Hiring Best Practices
Time: 3/30/2026, 2:45 PM
Device: 💻 Desktop

Details:
  • action: video_play
  • videoId: abc123
  • videoTitle: How to Hire Faster
  • duration_seconds: 600
  • autoplay: false
```

---

## 9️⃣ Custom Events - Product View

**Code**:
```javascript
// When user views a product
WebsiteTracker.track('custom', {
  action: 'product_view',
  productId: 'PROD-789',
  productName: 'Blue Widget Pro',
  category: 'electronics',
  price: 49.99,
  inStock: true
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: shop.example.com
Event: CUSTOM
Page: /products/blue-widget-pro
Title: Blue Widget Pro | Shop
Time: 3/30/2026, 3:15 PM
Device: 📱 Mobile

Details:
  • action: product_view
  • productId: PROD-789
  • productName: Blue Widget Pro
  • category: electronics
  • price: 49.99
  • inStock: true
```

---

## 🔟 Custom Events - Search

**Code**:
```javascript
// When user performs a search
WebsiteTracker.track('custom', {
  action: 'search',
  query: 'best headphones',
  resultsCount: 42,
  filters: 'price_under_100'
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: shop.example.com
Event: CUSTOM
Page: /search
Title: Search Results
Time: 3/30/2026, 4:00 PM
Device: 💻 Desktop

Details:
  • action: search
  • query: best headphones
  • resultsCount: 42
  • filters: price_under_100
```

---

## 1️⃣1️⃣ Custom Events - Download

**Code**:
```javascript
// When user downloads a file
WebsiteTracker.track('custom', {
  action: 'download',
  fileType: 'pdf',
  fileName: 'Hiring_Guide.pdf',
  fileSize_mb: 2.5
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: resources.example.com
Event: CUSTOM
Page: /resources
Title: Resource Library
Time: 3/30/2026, 4:30 PM
Device: 💻 Desktop

Details:
  • action: download
  • fileType: pdf
  • fileName: Hiring_Guide.pdf
  • fileSize_mb: 2.5
```

---

## 1️⃣2️⃣ Custom Events - Error

**Code**:
```javascript
// When an error occurs
WebsiteTracker.track('custom', {
  action: 'error',
  errorType: 'payment_failed',
  errorMessage: 'Card declined',
  errorCode: 'DECLINED_402'
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: myapp.com
Event: CUSTOM
Page: /checkout
Title: Checkout
Time: 3/30/2026, 5:00 PM
Device: 💻 Desktop

Details:
  • action: error
  • errorType: payment_failed
  • errorMessage: Card declined
  • errorCode: DECLINED_402
```

---

## 1️⃣3️⃣ Custom Events - Goal / Conversion

**Code**:
```javascript
// When user completes a goal
WebsiteTracker.track('custom', {
  action: 'goal_completed',
  goalName: 'Free Trial Signup',
  goalValue: 1,
  source: 'email_campaign'
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: saas-app.com
Event: CUSTOM
Page: /signup-success
Title: Welcome!
Time: 3/30/2026, 5:15 PM
Device: 💻 Desktop

Details:
  • action: goal_completed
  • goalName: Free Trial Signup
  • goalValue: 1
  • source: email_campaign
```

---

## 1️⃣4️⃣ Custom Events - Share / Referral

**Code**:
```javascript
// When user shares content
WebsiteTracker.track('custom', {
  action: 'content_shared',
  contentType: 'article',
  contentId: 'post-123',
  platform: 'twitter'
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: blog.example.com
Event: CUSTOM
Page: /articles/ai-trends-2026
Title: AI Trends in 2026
Time: 3/30/2026, 6:00 PM
Device: 📱 Mobile

Details:
  • action: content_shared
  • contentType: article
  • contentId: post-123
  • platform: twitter
```

---

## 1️⃣5️⃣ Custom Events - Newsletter Signup

**Code**:
```javascript
// When user subscribes to newsletter
WebsiteTracker.track('custom', {
  action: 'newsletter_signup',
  email: 'masked',
  source: 'sidebar_widget',
  frequency: 'weekly'
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: mysite.com
Event: CUSTOM
Page: /blog
Title: Blog
Time: 3/30/2026, 6:30 PM
Device: 💻 Desktop

Details:
  • action: newsletter_signup
  • email: masked
  • source: sidebar_widget
  • frequency: weekly
```

---

## 1️⃣6️⃣ Custom Events - Rating / Review

**Code**:
```javascript
// When user leaves a review
WebsiteTracker.track('custom', {
  action: 'review_submitted',
  productId: 'PROD-456',
  rating: 5,
  reviewLength: 450,
  verified_purchase: true
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: shop.example.com
Event: CUSTOM
Page: /products/blue-widget-pro/reviews
Title: Reviews
Time: 3/30/2026, 7:00 PM
Device: 💻 Desktop

Details:
  • action: review_submitted
  • productId: PROD-456
  • rating: 5
  • reviewLength: 450
  • verified_purchase: true
```

---

## 1️⃣7️⃣ Custom Events - Multi-Step Process

**Code**:
```javascript
// Track progress through a multi-step form
WebsiteTracker.track('custom', {
  action: 'checkout_step',
  step: 2,
  totalSteps: 3,
  formName: 'checkout_form'
});
```

**Message**:
```
📊 Visitor Tracking Alert

Website: shop.example.com
Event: CUSTOM
Page: /checkout/payment
Title: Checkout - Payment
Time: 3/30/2026, 7:30 PM
Device: 💻 Desktop

Details:
  • action: checkout_step
  • step: 2
  • totalSteps: 3
  • formName: checkout_form
```

---

## 1️⃣8️⃣ Mobile vs Desktop Messages

**Desktop Example**:
```
Device: 💻 Desktop
User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...
```

**Mobile Example**:
```
Device: 📱 Mobile
User Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)...
```

---

## 📝 Message Structure

Every Telegram message has this format:

```
📊 Visitor Tracking Alert

Website: [your-site.com]
Event: [PAGE VIEW / CUSTOM / CLICK / FORM SUBMIT]
Page: [/current/page/path]
Title: [Page Title]
Time: [Date and Time in your timezone]
Referrer: [source or "direct"]
Device: [💻 Desktop or 📱 Mobile]

Details:  (only if metadata provided)
  • key1: value1
  • key2: value2
  • key3: value3
```

---

## 🎯 Common Metadata Fields

```javascript
// E-commerce
{
  action: 'add_to_cart',
  productId: '123',
  productName: 'Widget',
  price: 29.99,
  quantity: 2
}

// SaaS
{
  action: 'feature_accessed',
  feature: 'export',
  tier: 'pro',
  duration_ms: 1200
}

// Content
{
  action: 'article_read',
  articleId: 'post-123',
  readTime_seconds: 480,
  wordCount: 2400
}

// Recruitment (Aurith)
{
  action: 'candidate_viewed',
  candidateId: 'cand-456',
  jobId: 'job-789',
  timeSpent_seconds: 45
}
```

---

## 💡 Tips for Better Messages

1. **Be Descriptive**: Use clear action names (`product_view` not `pv`)
2. **Include Context**: Add metadata about where/why (`location: 'hero'`)
3. **Mask Sensitive Data**: Never send emails or passwords in real values
4. **Use Consistent Keys**: `duration_ms` not `duration` or `dur`
5. **Include Timestamps**: Most events auto-include them
6. **Test First**: Run in debug mode before deployment

---

**Want to send custom events?** Just call:
```javascript
WebsiteTracker.track('custom', { action: 'your_event', ...data });
```

**Need help?** Check ANALYTICS_SETUP.md or ANALYTICS_EXAMPLES.md
