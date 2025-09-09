// Mock subscription service - replace with RevenueCat in production
export interface SubscriptionPlan {
  id: string;
  title: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
}

export interface PurchaseResult {
  success: boolean;
  subscriptionType?: "monthly" | "yearly" | "lifetime";
  trialEndDate?: Date;
  error?: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "monthly",
    title: "Monthly",
    price: "$1.99",
    period: "/month",
  },
  {
    id: "yearly",
    title: "Yearly",
    price: "$19.99",
    period: "/year",
    savings: "Save 17%",
    popular: true,
  },
  {
    id: "lifetime",
    title: "Lifetime",
    price: "$29.99",
    period: "one-time",
    savings: "Best Value",
  },
];

// Mock purchase function - replace with RevenueCat
export const purchaseSubscription = async (planId: string): Promise<PurchaseResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful purchase
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 day trial
  
  return {
    success: true,
    subscriptionType: planId as "monthly" | "yearly" | "lifetime",
    trialEndDate,
  };
};

// Mock restore purchases function
export const restorePurchases = async (): Promise<PurchaseResult> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: false,
    error: "No previous purchases found",
  };
};

// Check subscription status
export const checkSubscriptionStatus = async (): Promise<{
  isPremium: boolean;
  subscriptionType?: string;
  expiryDate?: Date;
}> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    isPremium: false,
  };
};

// Initialize subscription service
export const initializeSubscriptions = async (): Promise<void> => {
  // In production, this would initialize RevenueCat
  console.log("Subscription service initialized (mock)");
};