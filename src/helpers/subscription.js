import db from "../config/db.js";

export async function getActiveSubscription(userId) {
  let subscription = await db("user_subscriptions as us")
    .join("subscriptions as s", "us.subscription_id", "s.subscription_id")
    .where("us.user_id", userId)
    .where("us.status", "active")
    .orderBy("us.user_subscription_id", "desc")
    .select(
      "us.user_subscription_id as subscriptionInstanceId",
      "us.subscription_id",
      "s.Monthly_limit",
      "us.end_date"
    )
    .first();

  // Check if subscription is expired
  if (subscription && subscription.end_date && new Date(subscription.end_date) < new Date()) {
    await db("user_subscriptions")
      .where({ user_subscription_id: subscription.subscriptionInstanceId })
      .update({ status: "expired" });

    subscription = null;
  }

  if (!subscription) {
    // Fallback/Default to free plan
    const freePlan = await db("subscriptions")
      .where({ price: 0, isActive: 1 })
      .first();

    if (freePlan) {
      const startDate = new Date();

      const [insertedId] = await db("user_subscriptions").insert({
        user_id: userId,
        subscription_id: freePlan.subscription_id,
        razorpay_order_id: `free_sub_${Date.now()}_${userId}`,
        amount: 0,
        status: "active",
        start_date: startDate,
        end_date: null,
        quota_reset_at: startDate,
      });

      return {
        subscriptionInstanceId: insertedId,
        subscription_id: freePlan.subscription_id,
        Monthly_limit: freePlan.Monthly_limit
      };
    }
  }

  return subscription;
}

