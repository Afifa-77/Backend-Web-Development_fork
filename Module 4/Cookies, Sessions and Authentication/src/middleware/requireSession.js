
const prisma = require('../db/prisma');
const sessionStore = require('../session/sessionStore');

module.exports = async function requireSession(req, res, next) {
  try {
    const sid = req.signedCookies?.sid;

    if (!sid || typeof sid !== 'string') {
      return res.status(401).json({
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required',
        },
      });
    }

    const session = sessionStore.get(sid);

    if (!session) {
      return res.status(401).json({
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required',
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      sessionStore.destroy(sid);

      return res.status(401).json({
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required',
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
