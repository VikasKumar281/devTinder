const express = require("express");
const Stripe = require("stripe");
const premiumRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const Membership = require("../models/membership");
const { PLANS } = require("../utils/plans");
const { createNotification } = require("../utils/notify");
const Notification = require("../models/notification");

const PLAN_ORDER = ["pulse", "aura", "orbit"];

const allowedClients = [
  "http://localhost:5173",
  "https://dev-tinder-web-gules.vercel.app",
];

const clientUrl = (req) => {
  const origin = req?.headers?.origin;
  if (origin && allowedClients.includes(origin)) return origin;
  return process.env.CLIENT_URL || "http://localhost:5173";
};

const getStripe = () => {
  const key = (process.env.STRIPE_SECRET_KEY || "").trim();
  if (!key) return null;
  return new Stripe(key);
};

const orderedPlans = () => PLAN_ORDER.map((id) => PLANS[id]).filter(Boolean);

const expiryFromSubscription = (subscription) => {
  const end = subscription?.current_period_end;
  if (end) return new Date(end * 1000);
  return new Date(Date.now() + 31 * 24 * 60 * 60 * 1000);
};

const applyPlan = async (userId, plan, subscription, customerId, sessionId) => {
  if (!userId || !PLANS[plan]) return;
  const subscriptionId =
    typeof subscription === "string" ? subscription : subscription?.id;
  const customer =
    typeof customerId === "string" ? customerId : customerId?.id;
  const expiresAt = expiryFromSubscription(subscription);

  await User.findByIdAndUpdate(userId, {
    membershipType: plan,
    isPremium: true,
    stripeSubscriptionId: subscriptionId || undefined,
    stripeCustomerId: customer || undefined,
    membershipExpiresAt: expiresAt,
  });

  await Membership.findOneAndUpdate(
    {
      userId,
      stripeSubscriptionId: subscriptionId || sessionId || plan,
    },
    {
      userId,
      plan,
      amount: PLANS[plan].monthlyAmount,
      currency: "inr",
      stripeCustomerId: customer,
      stripeSubscriptionId: subscriptionId,
      stripeSessionId: sessionId,
      status: "active",
      expiresAt,
    },
    { upsert: true, new: true }
  );

  const recent = await Notification.findOne({
    userId,
    type: "membership",
    createdAt: { $gt: new Date(Date.now() - 2 * 60 * 1000) },
  });
  if (!recent) {
    await createNotification({
      userId,
      type: "membership",
      title: "You're on " + PLANS[plan].name,
      body: PLANS[plan].tagline + " · " + PLANS[plan].displayPrice + "/month",
      link: "/premium",
    });
  }
};

premiumRouter.get("/premium/plans", (req, res) => {
  res.json({
    data: {
      currency: "inr",
      stripeReady: Boolean((process.env.STRIPE_SECRET_KEY || "").trim()),
      plans: orderedPlans(),
    },
  });
});

premiumRouter.get("/premium/status", userAuth, async (req, res) => {
  const user = req.user;
  const expired =
    user.membershipExpiresAt && new Date(user.membershipExpiresAt) < new Date();
  const membershipType = expired ? "free" : user.membershipType || "free";
  const purchases = await Membership.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(8);
  res.json({
    data: {
      membershipType,
      isPremium: expired ? false : Boolean(user.isPremium),
      membershipExpiresAt: user.membershipExpiresAt || null,
      plan: PLANS[membershipType] || null,
      purchases,
    },
  });
});

premiumRouter.post("/premium/checkout", userAuth, async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      throw new Error("Stripe is not configured yet. Add STRIPE_SECRET_KEY.");
    }
    const planId = String(req.body.plan || "").toLowerCase();
    const plan = PLANS[planId];
    if (!plan) {
      throw new Error("Choose Pulse, Aura, or Orbit");
    }

    if (req.user.isPremium && req.user.membershipType === plan.id) {
      throw new Error("You already have this plan");
    }

    const sessionConfig = {
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "DevTinder " + plan.name,
              description: plan.tagline,
            },
            unit_amount: plan.monthlyAmount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: clientUrl(req) + "/premium/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: clientUrl(req) + "/premium",
      client_reference_id: String(req.user._id),
      metadata: {
        userId: String(req.user._id),
        plan: plan.id,
      },
      subscription_data: {
        metadata: {
          userId: String(req.user._id),
          plan: plan.id,
        },
      },
    };

    if (req.user.stripeCustomerId) {
      sessionConfig.customer = req.user.stripeCustomerId;
    } else {
      sessionConfig.customer_email = req.user.emailId;
    }

    let session;
    try {
      session = await stripe.checkout.sessions.create(sessionConfig);
    } catch (stripeErr) {
      const code = stripeErr?.raw?.code || stripeErr?.code;
      if (sessionConfig.customer && code === "resource_missing") {
        delete sessionConfig.customer;
        sessionConfig.customer_email = req.user.emailId;
        session = await stripe.checkout.sessions.create(sessionConfig);
      } else {
        throw stripeErr;
      }
    }
    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }
    res.json({ data: { url: session.url } });
  } catch (err) {
    const message = err?.raw?.message || err.message || "Checkout failed";
    res.status(400).json({ message });
  }
});

premiumRouter.get("/premium/session/:id", userAuth, async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) throw new Error("Stripe is not configured");
    const session = await stripe.checkout.sessions.retrieve(req.params.id, {
      expand: ["subscription"],
    });
    const userId = session.metadata?.userId || session.client_reference_id;
    if (userId !== String(req.user._id)) {
      throw new Error("Session does not match this account");
    }

    if (
      session.payment_status === "paid" ||
      session.status === "complete"
    ) {
      await applyPlan(
        userId,
        session.metadata?.plan,
        session.subscription,
        session.customer,
        session.id
      );
    }

    const fresh = await User.findById(req.user._id).select(
      "membershipType isPremium membershipExpiresAt"
    );
    res.json({
      data: {
        status: session.payment_status,
        plan: fresh?.membershipType || session.metadata?.plan || null,
        isPremium: Boolean(fresh?.isPremium),
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const handleStripeWebhook = async (req, res) => {
  const stripe = getStripe();
  const signature = req.headers["stripe-signature"];
  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
  if (!stripe) {
    return res.status(400).send("Stripe is not configured");
  }
  if (!webhookSecret) {
    return res.status(400).send("Webhook secret is not configured");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    return res.status(400).send("Webhook error: " + err.message);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId || session.client_reference_id;
      await applyPlan(
        userId,
        session.metadata?.plan,
        session.subscription,
        session.customer,
        session.id
      );
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.created"
    ) {
      const sub = event.data.object;
      const plan = sub.metadata?.plan;
      const userId = sub.metadata?.userId;
      if (sub.status === "active" || sub.status === "trialing") {
        await applyPlan(userId, plan, sub, sub.customer);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      const userId = sub.metadata?.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          membershipType: "free",
          isPremium: false,
          stripeSubscriptionId: null,
        });
      } else if (sub.customer) {
        await User.findOneAndUpdate(
          { stripeCustomerId: sub.customer },
          {
            membershipType: "free",
            isPremium: false,
            stripeSubscriptionId: null,
          }
        );
      }
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { premiumRouter, handleStripeWebhook };
