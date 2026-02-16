import redis from "../config/redis.js";
import { sendEmailandOtp, sendForget } from "./sendOtp.js";


export const checkOtpRestrictions = async (identifier) => {
  const lockKey = `otp_lock:${identifier}`;
  const spamLockKey = `otp_spam_lock:${identifier}`;
  const cooldownKey = `otp_cooldown:${identifier}`;

  if (await redis.get(lockKey)) {
    return {
      success: false,
      status: 429,
      message: "Email locked due to multiple failed attempts. Try again after 30 minutes.",
    };
  }

  if (await redis.get(spamLockKey)) {
    return {
      success: false,
      status: 429,
      message: "Too many OTP requests. Please wait 1 hour before trying again.",
    };
  }

  if (await redis.get(cooldownKey)) {
    return {
      success: false,
      status: 429,
      message: "Please wait 1 minute before requesting a new OTP.",
    };
  }

  return { success: true };
};


export const trackOtpRequests = async (identifier) => {
  const otpRequestKey = `otp_request_count:${identifier}`;
  const spamLockKey = `otp_spam_lock:${identifier}`;

  const currentCount = parseInt((await redis.get(otpRequestKey)) || "0");

  if (currentCount >= 2) {
    await redis.set(spamLockKey, "locked", "EX", 3600);

    return {
      success: false,
      status: 400,
      message: "Too many OTP requests. Please wait 1 hour before trying again.",
    };
  }

  await redis.set(otpRequestKey, currentCount + 1, "EX", 3600);
  return { success: true };
};


export const sendOtpByEmail = async (username, identifier) => {
  if (!identifier) {
    return {
      success: false,
      status: 400,
      message: "Email is required",
    };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(`otp:${identifier}`, otp, "EX", 300); 
  await redis.set(`otp_cooldown:${identifier}`, "1", "EX", 60); 

  try {
    await sendEmailandOtp(username, identifier, otp);
    return { success: true };
  } catch (err) {
    console.error("OTP EMAIL ERROR:", err);
    return {
      success: false,
      status: 500,
      message: "Failed to send OTP email",
    };
  }
};

export const sendOtpByForget = async (username, identifier) => {
  if (!identifier) {
    return {
      success: false,
      status: 400,
      message: "Email is required",
    };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(`otp:${identifier}`, otp, "EX", 300); 
  await redis.set(`otp_cooldown:${identifier}`, "1", "EX", 60); 

  try {
    await sendForget(username, identifier, otp);
    return { success: true };
  } catch (err) {
    console.error("OTP EMAIL ERROR:", err);
    return {
      success: false,
      status: 500,
      message: "Failed to send OTP email",
    };
  }
};
