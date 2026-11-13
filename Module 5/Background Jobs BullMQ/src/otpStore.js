
const otpStore = new Map();

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function storeOTP(email, otp) {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });
}

function verifyOTP(email, code) {
  const record = otpStore.get(email);

  if (!record) {
    return { ok: false, reason: 'not_found' };
  }

  if (Date.now() > record.expiresAt) {
    return { ok: false, reason: 'expired' };
  }

  if (record.attempts >= 3) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  if (record.otp !== String(code)) {
    record.attempts++;
    return { ok: false, reason: 'wrong_code' };
  }

  otpStore.delete(email);
  return { ok: true };
}

function markVerified(email) {
  otpStore.delete(email);
}

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  markVerified,
  _store: otpStore,
};
