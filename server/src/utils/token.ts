import crypto from "crypto";

export const generateEmailVerificationOTP = () => {
  // Generate a 6-digit numeric OTP
  const rawOTP = Math.floor(100000 + Math.random() * 900000).toString(); // "123456"

  // Hash it before storing
  const hashedOTP = crypto
    .createHash("sha256")
    .update(rawOTP)
    .digest("hex");

  // Set expiry 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return {
    rawOTP,       // send this via email/SMS
    hashedOTP,    // store in DB
    expiresAt,
  };
};


export const verifyOTP = (inputOTP: string, hashedOTP: string) => {
  const hash = crypto.createHash("sha256").update(inputOTP).digest("hex");
  return hash === hashedOTP;
};