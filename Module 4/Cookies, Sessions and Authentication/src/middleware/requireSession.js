// TODO: read req.signedCookies.sid, resolve the server session,
// attach identity to the request, and return generic 401 when invalid.
module.exports = function requireSession(req, res, next) {
  next();
};
