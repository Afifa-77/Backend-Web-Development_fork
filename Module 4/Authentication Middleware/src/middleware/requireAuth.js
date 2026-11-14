
const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
    // Read Authorization header
    const authHeader = req.headers.authorization ?? '';

    // Extract Bearer token
    const match = authHeader.match(/^Bearer ([^\s]+)$/i);
    const token = match ? match[1] : null;

    // Check if token is missing
    if (token === null) {
        return res.status(401).json({
            error: {
                code: 'AUTH_REQUIRED',
                message: 'Authentication required'
            }
        });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ['HS256']
            }
        );

        // Attach verified payload to req.user
        req.user = decoded;

        // Continue to the next handler
        return next();

    } catch (error) {
        // Return generic authentication error
        return res.status(401).json({
            error: {
                code: 'AUTH_REQUIRED',
                message: 'Authentication required'
            }
        });
    }
};
