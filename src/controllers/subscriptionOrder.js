import crypto from "crypto";
import db from "../config/db.js";
import instance from "../libs/razorpay.js";


export const createSubscriptionOrder = async (req, res) => {
  try {
    const { user_id, subscription_id } = req.body;

    if (!user_id || !subscription_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    const plan = await db("subscriptions")
      .where({ subscription_id, isActive: 1 })
      .first();

    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }


    if (plan.price <= 0) {
      return res.status(400).json({
        message: "Free plan does not require payment",
      });
    }

    // Check for existing active or expired subscription for renewal
    const existingSubscription = await db("user_subscriptions")
      .where({ user_id, subscription_id })
      .whereIn("status", ["active", "expired"])
      .select("status", "end_date")
      .first();

    // If renewing, mark existing subscription as cancelled
    if (existingSubscription) {
      await db("user_subscriptions")
        .where({ user_id, subscription_id })
        .whereIn("status", ["active", "expired"])
        .update({
          status: "cancelled",
          updated_at: new Date()
        });
    }

    const order = await instance.orders.create({
      amount: plan.price * 100,
      currency: "INR",
      receipt: `sub_${Date.now()}`,
      notes: {
        user_id,
        subscription_id,
        is_renewal: existingSubscription ? "true" : "false",
      },
    });



    await db("user_subscriptions").insert({
      user_id,
      subscription_id,
      razorpay_order_id: order.id,
      amount: plan.price,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      order,
      plan,
      is_renewal: !!existingSubscription,
    });
  } catch (error) {
    console.error("Create order error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const verifySubscriptionPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const subscription = await db("user_subscriptions")
      .where({ razorpay_order_id })
      .first();

    if (!subscription || subscription.status !== "pending") {
      return res.status(400).json({ message: "Invalid subscription state" });
    }


    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }


    const previousActive = await db("user_subscriptions")
      .where({
        user_id: subscription.user_id,
        subscription_id: subscription.subscription_id,
        status: "active",
      })
      .orderBy("end_date", "desc")
      .first();

    const now = new Date();


    const startDate =
      previousActive && new Date(previousActive.end_date) > now
        ? new Date(previousActive.end_date)
        : now;

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    await db.transaction(async (trx) => {

      if (previousActive) {
        await trx("user_subscriptions")
          .where({
            user_subscription_id: previousActive.user_subscription_id,
          })
          .update({
            status: "expired",
            updated_at: now,
          });
      }

      await trx("user_subscriptions")
        .where({
          user_subscription_id: subscription.user_subscription_id,
        })
        .update({
          razorpay_payment_id,
          status: "active",
          start_date: startDate,
          end_date: endDate,
          quota_reset_at: startDate,
          updated_at: now,
        });
    });

    return res.json({
      success: true,
      message: "Subscription activated & quota reset",
    });

  } catch (error) {
    console.error("Verify subscription error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


import { getActiveSubscription as ensureActiveSubscription } from "../helpers/subscription.js";

export const getUserActiveSubscription = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID required" });
    }


    await ensureActiveSubscription(user_id);

   const subscription = await db("user_subscriptions")
  .join(
    "subscriptions",
    "user_subscriptions.subscription_id",
    "subscriptions.subscription_id"
  )
  .where({
    "user_subscriptions.user_id": user_id,
    "user_subscriptions.status": "active",
  })
  .orderByRaw(`
    CASE 
      WHEN subscriptions.Monthly_limit > 0 THEN 1
      ELSE 2
    END
  `)
  .orderBy("user_subscriptions.created_at", "desc")
  .select(
    "user_subscriptions.subscription_id",
    "user_subscriptions.start_date",
    "user_subscriptions.end_date",
    "user_subscriptions.status",
    "subscriptions.name",
    "subscriptions.features",
    "subscriptions.Monthly_limit"
  )
  .first();


    return res.status(200).json({
      success: true,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
