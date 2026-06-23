export enum SubscriptionPlan {
  FREE = "free",
  PREMIUM = "premium",
}

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  [SubscriptionPlan.FREE]: "Free",
  [SubscriptionPlan.PREMIUM]: "Premium",
}

export const PLAN_LIMITS: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.FREE]: 5,
  [SubscriptionPlan.PREMIUM]: Infinity,
}
