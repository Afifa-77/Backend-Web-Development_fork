
'use strict';

const router = require('express').Router();
const { passport } = require('../auth/passport');
const { signToken } = require('../utils/jwt');

// Route 1: Start Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['openid', 'email', 'profile'],
    session: false,
  }),
);

// Route 2: Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/failure',
  }),
  (req, res) => {
    // Create our own application JWT
    const token = signToken({
      sub: req.user.id,
      role: req.user.role,
    });

    // Send JWT to the client
    res.json({ token });
  },
);

// Route 3: OAuth failure
router.get('/failure', (_req, res) => {
  res.status(401).json({
    error: {
      code: 'OAUTH_FAILED',
      message: 'Google login failed or was denied',
    },
  });
});

module.exports = router;
