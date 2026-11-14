
const crypto = require('crypto');

const sessions = new Map();

const SESSION_MAX_AGE = Number(process.env.SESSION_TTL_MS) || 3600000; // 1 hour

function create(userId) {
  const id = crypto.randomUUID();

  const session = {
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_AGE),
  };

  sessions.set(id, session);

  return {
    id,
    ...session,
  };
}

function get(id) {
  if (!id) {
    return null;
  }

  const session = sessions.get(id);

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    sessions.delete(id);
    return null;
  }

  return session;
}

function destroy(id) {
  if (!id) {
    return;
  }

  sessions.delete(id);
}

module.exports = {
  create,
  get,
  destroy,
};
