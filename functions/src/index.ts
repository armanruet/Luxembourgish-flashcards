import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import * as cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe with secret key
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2024-06-20',
});

// CORS configuration
const corsHandler = cors({ origin: true });

// Subscription tier type
type SubscriptionTier = 'free' | 'premium';

// Subscription limits
interface SubscriptionLimits {
  maxDecks: number;
  maxCardsPerDeck: number;
  hasOfflineMode: boolean;
  hasAdvancedAnalytics: boolean;
  hasCustomDecks: boolean;
  hasDataExport: boolean;
  hasAIFeatures: boolean;
  hasPrioritySupport: boolean;
  hasAdvancedStatistics: boolean;
}

// User subscription interface
interface UserSubscription {
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired';
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: admin.firestore.Timestamp;
  currentPeriodEnd?: admin.firestore.Timestamp;
  cancelAtPeriodEnd?: boolean;
  trialEnd?: admin.firestore.Timestamp;
  limits: SubscriptionLimits;
}

// Subscription limits by tier
const getSubscriptionLimits = (tier: SubscriptionTier): SubscriptionLimits => {
  switch (tier) {
    case 'free':
      return {
        maxDecks: 3,
        maxCardsPerDeck: 100,
        hasOfflineMode: false,
        hasAdvancedAnalytics: false,
        hasCustomDecks: false,
        hasDataExport: false,
        hasAIFeatures: false,
        hasPrioritySupport: false,
        hasAdvancedStatistics: false,
      };
    case 'premium':
      return {
        maxDecks: -1, // Unlimited
        maxCardsPerDeck: -1,
        hasOfflineMode: true,
        hasAdvancedAnalytics: true,
        hasCustomDecks: true,
        hasDataExport: true,
        hasAIFeatures: true,
        hasPrioritySupport: true,
        hasAdvancedStatistics: true,
      };
    default:
      return getSubscriptionLimits('free');
  }
};

// Create Stripe checkout session
export const createCheckoutSession = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const { userId, priceId, tier, successUrl, cancelUrl } = req.body;

      if (!userId || !priceId || !tier || !successUrl || !cancelUrl) {
        res.status(400).send('Missing required parameters');
        return;
      }

      // Get or create Stripe customer
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      let customerId = userData?.subscription?.stripeCustomerId;

      if (!customerId) {
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          email: userData?.email,
          metadata: {
            firebaseUID: userId,
          },
        });
        customerId = customer.id;

        // Update user with customer ID
        await admin.firestore().collection('users').doc(userId).update({
          'subscription.stripeCustomerId': customerId,
        });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          tier,
        },
        subscription_data: {
          trial_period_days: 14, // 14-day free trial
          metadata: {
            userId,
            tier,
          },
        },
      });

      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Create customer portal session
export const createPortalSession = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const { userId, returnUrl } = req.body;

      if (!userId || !returnUrl) {
        res.status(400).send('Missing required parameters');
        return;
      }

      // Get user's Stripe customer ID
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();
      const customerId = userData?.subscription?.stripeCustomerId;

      if (!customerId) {
        res.status(400).send('No Stripe customer found');
        return;
      }

      // Create portal session
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating portal session:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Stripe webhook handler
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = functions.config().stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    res.status(400).send('Webhook Error');
    return;
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Webhook Error');
  }
});

// Handle subscription changes
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  const tier = subscription.metadata.tier as SubscriptionTier;

  if (!userId || !tier) {
    console.error('Missing userId or tier in subscription metadata');
    return;
  }

  const subscriptionData: UserSubscription = {
    status: subscription.status as any,
    tier,
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    currentPeriodStart: admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_start * 1000)),
    currentPeriodEnd: admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_end * 1000)),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    trialEnd: subscription.trial_end ? admin.firestore.Timestamp.fromDate(new Date(subscription.trial_end * 1000)) : undefined,
    limits: getSubscriptionLimits(tier),
  };

  await admin.firestore().collection('users').doc(userId).update({
    subscription: subscriptionData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Updated subscription for user ${userId} to ${tier}`);
}

// Handle subscription cancellation
async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    console.error('Missing userId in subscription metadata');
    return;
  }

  const subscriptionData: UserSubscription = {
    status: 'canceled',
    tier: 'free',
    limits: getSubscriptionLimits('free'),
  };

  await admin.firestore().collection('users').doc(userId).update({
    subscription: subscriptionData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Cancelled subscription for user ${userId}`);
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await handleSubscriptionChange(subscription);
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Find user by customer ID
  const usersQuery = await admin.firestore()
    .collection('users')
    .where('subscription.stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (!usersQuery.empty) {
    const userDoc = usersQuery.docs[0];
    await userDoc.ref.update({
      'subscription.status': 'past_due',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Payment failed for user ${userDoc.id}`);
  }
}

// Get subscription status (for debugging)
export const getSubscriptionStatus = functions.https.onRequest((req, res) => {
  return corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const { userId } = req.body;

      if (!userId) {
        res.status(400).send('Missing userId parameter');
        return;
      }

      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();
      const subscription = userData?.subscription;

      res.json({ subscription });
    } catch (error) {
      console.error('Error getting subscription status:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});
