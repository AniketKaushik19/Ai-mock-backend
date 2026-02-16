import express from 'express'
import {  
  createSubscriptionPlan,
  getSubscriptionPlan, 
  getActiveSubscriptionPlans,
  editSubscriptionPlan,
  deleteSubscriptionPlan 
} from '../controllers/subscription.js'
import { 
  createSubscriptionOrder, 
  verifySubscriptionPayment,
  getUserActiveSubscription 
} from '../controllers/subscriptionOrder.js'

const router = express.Router()


router.post("/createPlan", createSubscriptionPlan)
router.get("/getPlan", getSubscriptionPlan)
router.put("/editPlan/:subscription_id", editSubscriptionPlan)
router.delete("/deletePlan/:subscription_id", deleteSubscriptionPlan)


router.get("/getActivePlans", getActiveSubscriptionPlans)
router.post("/create", createSubscriptionOrder)
router.post("/verify-payment", verifySubscriptionPayment)
router.get("/user/:user_id", getUserActiveSubscription)

export default router