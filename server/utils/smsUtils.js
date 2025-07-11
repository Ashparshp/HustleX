const sendSMS = async (to, message) => {
  try {
    // In production, replace this with actual SMS API call
    console.log(`SMS sent to ${to}: ${message}`);

    // Simulating successful SMS delivery for development
    return {
      success: true,
      messageId: `dev-${Date.now()}`,
    };
  } catch (error) {
    console.error("SMS sending error:", error);
    throw new Error("Failed to send SMS");
  }
};

// Send verification code via SMS
const sendVerificationSMS = async (phoneNumber, code) => {
  const message = `Your verification code is: ${code}. It will expire in 10 minutes.`;
  return await sendSMS(phoneNumber, message);
};

module.exports = {
  sendSMS,
  sendVerificationSMS,
};
