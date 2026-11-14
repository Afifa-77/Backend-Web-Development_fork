const express = require('express');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  // TODO: validate credentials, create a server session, and set signed `sid` cookie.
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Implement login' } });
});

router.get('/me', async (req, res, next) => {
  // TODO: resolve signed cookie through the server-side session store.
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Implement protected identity' } });
});

router.post('/logout', async (req, res, next) => {
  // TODO: destroy server session and clear cookie using matching options.
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Implement logout' } });
});

module.exports = router;
