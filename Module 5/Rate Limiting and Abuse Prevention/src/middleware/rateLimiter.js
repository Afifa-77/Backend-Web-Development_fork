'use strict';
// middleware/rateLimiter.js


const rateLimit = require('express-rate-limit');


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 failed attempts per IP
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,


    handler: (req, res) => {
        const resetTime = req.rateLimit?.resetTime;


        const retryAfter = resetTime
            ? Math.max(1, Math.ceil((resetTime - Date.now()) / 1000))
            : 900;


        res.setHeader('Retry-After', String(retryAfter));


        res.status(429).json({
            message: 'Too many requests, please try again later.'
        });
    },


    // Redis scaling:
    // In a multi-instance deployment, rate-limit-redis can replace
    // the default in-memory store with a shared Redis store.
    // All server instances then use the same request counter.
    // The in-memory store is insufficient because each instance
    // maintains a separate counter, allowing users to exceed the
    // intended limit when requests are distributed by a load balancer.
});


module.exports = authLimiter;