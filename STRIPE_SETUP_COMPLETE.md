# Complete Stripe Integration Setup Guide

## 🎉 What You Now Have

Your Luxembourgish Flashcard app now includes a complete subscription system with:

✅ **Two-Tier Model**: Free (3 decks) + Premium ($4.99/month)
✅ **Full Stripe Integration**: Real payment processing with webhooks
✅ **Firebase Functions**: Backend serverless infrastructure
✅ **Feature Gating**: Automatic limitation enforcement
✅ **Beautiful UI**: Professional pricing and payment pages
✅ **14-Day Free Trial**: Risk-free premium experience

## 🚀 Setup Instructions (Complete in ~2 hours)

### Part 1: Stripe Account Setup (20 minutes)

#### 1.1 Create Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Complete account setup and verification
3. Switch to **Test mode** (toggle in top right)

#### 1.2 Create Products and Prices
1. Go to **Products** → **Create product**
2. Create "Premium Subscription":
   - Name: `Premium Subscription`
   - Description: `Unlimited flashcard decks and premium features`
   - Pricing model: `Recurring`
   - Price: `$4.99` USD per `month`
   - Copy the **Price ID** (starts with `price_`)

3. Create yearly price:
   - Same product, add another price: `$49.99` USD per `year`
   - Copy this **Price ID** too

#### 1.3 Get API Keys
1. Go to **Developers** → **API keys**
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (starts with `sk_test_`) - Keep this secure!

#### 1.4 Create Webhook Endpoint
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://us-central1-luxembourgishflashcards.cloudfunctions.net/stripeWebhook`
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

### Part 2: Firebase Functions Setup (30 minutes)

#### 2.1 Install Dependencies
```bash
cd /Users/arman/Desktop/Flashcard/functions
npm install
```

#### 2.2 Configure Firebase Functions
```bash
# Set Stripe configuration
firebase functions:config:set stripe.secret_key="sk_test_your_secret_key"
firebase functions:config:set stripe.webhook_secret="whsec_your_webhook_secret"
```

#### 2.3 Deploy Functions
```bash
# Build and deploy
npm run build
firebase deploy --only functions
```

#### 2.4 Update Firestore Security Rules
In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /decks/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Part 3: Frontend Configuration (10 minutes)

#### 3.1 Update Environment Variables
Update your `.env` file:
```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

#### 3.2 Update Subscription Plans
In `src/types/index.ts`, update the price IDs:
```typescript
premium: {
  // ... other config
  monthlyPriceId: 'price_your_monthly_price_id', // Replace with actual
  yearlyPriceId: 'price_your_yearly_price_id',   // Replace with actual
}
```

### Part 4: GitHub Deployment (15 minutes)

#### 4.1 Add GitHub Secrets
Go to: https://github.com/armanruet/Luxembourgish-flashcards/settings/secrets/actions

Add this new secret:
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

#### 4.2 Deploy Updated Code
```bash
git add .
git commit -m "🚀 Add complete Stripe subscription system

✨ Features:
- Full Stripe integration with webhooks
- Firebase Functions for payment processing
- Two-tier pricing: Free + Premium ($4.99/month)
- 14-day free trial
- Feature gating and upgrade prompts
- Beautiful pricing and success pages

🛠️ Technical:
- Stripe checkout sessions
- Webhook handling for subscription events
- Real-time subscription status updates
- Secure payment processing"

git push origin main
```

### Part 5: Testing (30 minutes)

#### 5.1 Test Stripe Integration
1. Use test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC
4. Any ZIP code

#### 5.2 Test User Flow
1. **Free User Experience**:
   - Create account
   - Try to create 4th deck → See upgrade prompt
   - Click upgrade → Stripe checkout

2. **Premium User Experience**:
   - Complete test subscription
   - Verify unlimited deck creation
   - Check advanced features access

3. **Webhook Testing**:
   - Complete subscription → Check Firebase for updated user data
   - Cancel subscription in Stripe → Check Firebase for status change

#### 5.3 Production Readiness Checklist
- [ ] Stripe webhooks responding correctly
- [ ] User subscriptions updating in Firebase
- [ ] Feature gating working properly
- [ ] Payment flow smooth end-to-end
- [ ] Error handling for failed payments
- [ ] Customer portal accessible from settings

## 🔧 Troubleshooting

### Common Issues:

1. **"Functions not found" Error**
   - Ensure functions are deployed: `firebase deploy --only functions`
   - Check function URLs in browser console

2. **Webhook Not Working**
   - Verify webhook URL in Stripe dashboard
   - Check Firebase Functions logs: `firebase functions:log`

3. **Subscription Not Updating**
   - Check webhook events are selected correctly
   - Verify webhook secret is set: `firebase functions:config:get`

4. **Stripe Checkout Error**
   - Verify publishable key is correct
   - Check browser console for detailed errors

### Debug Commands:
```bash
# Check function configuration
firebase functions:config:get

# View function logs
firebase functions:log

# Test functions locally
firebase emulators:start --only functions
```

## 🎯 Go-Live Checklist

### Before Production:
1. **Switch to Stripe Live Mode**
2. **Update API keys** (remove `test` from keys)
3. **Update webhook URL** to production
4. **Test with real card** (small amount)
5. **Update GitHub secrets** with live keys

### Production Monitoring:
- Monitor Stripe dashboard for payments
- Check Firebase Functions logs for errors
- Track subscription conversion rates
- Monitor customer support requests

## 💰 Revenue Expectations

### Conservative Projections:
- **1,000 active users** × **5% conversion** = **50 premium users**
- **Monthly Revenue**: 50 × $4.99 = **$249.50**
- **Annual Revenue**: $249.50 × 12 = **$2,994**

### Growth Scenario (6 months):
- **5,000 active users** × **8% conversion** = **400 premium users**
- **Monthly Revenue**: 400 × $4.99 = **$1,996**
- **Annual Revenue**: $1,996 × 12 = **$23,952**

### Success Factors:
1. **Value-First Free Tier**: 3 decks must provide real value
2. **Clear Premium Benefits**: Make limitations feel natural, not punishing
3. **Smooth Upgrade Flow**: Minimal friction in payment process
4. **Excellent Customer Support**: Happy customers = better retention

## 🎉 You're Done!

Your flashcard app now has:
- **Enterprise-grade payment processing**
- **Scalable subscription management**
- **Professional user experience**
- **Real revenue potential**

**Next Steps**: Launch, gather user feedback, and iterate on pricing and features based on real usage data!

---

**Need Help?** Check the troubleshooting section or contact support.
