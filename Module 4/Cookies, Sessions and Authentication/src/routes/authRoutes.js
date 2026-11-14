
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = require('../db/prisma');
const sessionStore = require('../session/sessionStore');
const requireSession = require('../middleware/requireSession');

const router = express.Router();

const COOKIE_NAME = 'sid';
const SESSION_MAX_AGE = 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: 'lax',
  signed: true,
  path: '/',
  maxAge: SESSION_MAX_AGE,
};

function authError(res) {
  return res.status(401).json({
    error: {
      code: 'AUTH_REQUIRED',
      message: 'Authentication required',
    },
  });
}

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const email =
      typeof req.body?.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';

    const password =
      typeof req.body?.password === 'string'
        ? req.body.password
        : '';

    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return authError(res);
    }

    const session = sessionStore.create(user.id);

    res.cookie(COOKIE_NAME, session.id, cookieOptions);

    return res.status(200).json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PROTECTED USER IDENTITY
router.get('/me', requireSession, (req, res) => {
  return res.status(200).json({
    data: req.user,
  });
});

// LOGOUT
router.post('/logout', (req, res, next) => {
  try {
    const sid = req.signedCookies?.[COOKIE_NAME];

    if (typeof sid === 'string') {
      sessionStore.destroy(sid);
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      signed: cookieOptions.signed,
      path: cookieOptions.path,
    });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
