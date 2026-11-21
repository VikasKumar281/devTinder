const PLANS = {
  pulse: {
    id: "pulse",
    name: "Pulse",
    tagline: "Swipe without the countdown.",
    monthlyAmount: 49900,
    displayPrice: "₹499",
    period: "month",
    accent: "#60a5fa",
    features: [
      "Unlimited likes on the feed",
      "Undo your last pass",
      "Browse other cities before you travel",
      "Quieter feed with fewer interruptions",
      "Show up only to people you already liked",
    ],
  },
  aura: {
    id: "aura",
    name: "Aura",
    tagline: "Know who already wants to build with you.",
    monthlyAmount: 99900,
    displayPrice: "₹999",
    period: "month",
    accent: "#f59e0b",
    popular: true,
    features: [
      "Everything in Pulse",
      "See who sent you a like first",
      "Three Super Pings every week",
      "One profile Boost each month",
    ],
  },
  orbit: {
    id: "orbit",
    name: "Orbit",
    tagline: "Land at the top of their stack.",
    monthlyAmount: 149900,
    displayPrice: "₹1,499",
    period: "month",
    accent: "#c4b5fd",
    features: [
      "Everything in Aura",
      "Your likes jump the queue",
      "Send a note before they match",
      "Priority placement in nearby feeds",
    ],
  },
};

module.exports = { PLANS };
