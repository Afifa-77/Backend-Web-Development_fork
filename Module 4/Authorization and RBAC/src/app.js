require('dotenv').config();

const express = require('express');
const requireAuth = require('./middleware/requireAuth');
const requireRole = require('./middleware/requireRole');
const { signToken } = require('./utils/jwt');
const { users } = require('./data');
const postsRouter = require('./routes/posts');

const app = express();

app.use(express.json());

// Public login route
app.post('/auth/login', (req, res) => {
  const sub = req.body.sub || 'u-A';
  const role = req.body.role || 'member';

  return res.status(200).json({
    token: signToken(sub, role),
  });
});

// Authentication required for routes below
app.use(requireAuth);

// Posts routes
app.use('/posts', postsRouter);

// Delete user - admin only
app.delete('/users/:id', requireRole('admin'), (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'User not found',
      },
    });
  }

  users.splice(idx, 1);

  return res.status(200).json({ ok: true });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error.message);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`RBAC starter listening on ${port}`);
});

module.exports = app;