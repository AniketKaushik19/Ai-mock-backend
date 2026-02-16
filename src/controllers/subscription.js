import crypto from 'crypto'
import Razorpay from 'razorpay';
import db from "../config/db.js";





export const createSubscriptionPlan = async (req, res) => {
  try {
    const { name, features, price, Monthly_limit, isActive } = req.body;

  

    if (!name || !features || price===undefined || price===null) {
      return res.status(400).json({
        message: "name, features and price are required",
      });
    }

    await db("subscriptions").insert({
      name,
      features,                 
      price,
      Monthly_limit: Monthly_limit || null,
      isActive: isActive ?? 1, 
    });

    res.status(201).json({
      success: true,
      message: "Subscription plan created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating subscription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getSubscriptionPlan = async (req, res) => {
  try {
    const plans = await db("subscriptions")
      .select(
        "subscription_id",
        "name",
        "features",
        "price",
        "Monthly_limit",
        "isActive",
        "created_at",
        "updated_at"
      );

    res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getActiveSubscriptionPlans = async (req, res) => {
  try {
    const plans = await db("subscriptions")
      .where({ isActive: 1 })
      .select("*");

    res.status(200).json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};





export const editSubscriptionPlan = async (req, res) => {
  try {
    const { subscription_id } = req.params;
    const { name, features, price, Monthly_limit, isActive } = req.body;

    const updated = await db("subscriptions")
      .where({ subscription_id })
      .update({
        name,
        features,
        price,
        Monthly_limit,
        isActive,
        updated_at: db.fn.now(),
      });

    if (!updated) {
      return res.status(404).json({
        message: "Subscription plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription plan updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubscriptionPlan = async (req, res) => {
  try {
    const { subscription_id } = req.params;

    const deleted = await db("subscriptions")
      .where({ subscription_id })
      .del();

    if (!deleted) {
      return res.status(404).json({
        message: "Subscription plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription plan deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

