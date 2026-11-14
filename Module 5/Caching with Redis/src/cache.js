
'use strict';

const Redis = require('ioredis');

// Create Redis instance
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  lazyConnect: true,
});

// Get data from cache
async function cacheGet(key) {
  try {
    const value = await redis.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error('Cache GET error:', error.message);
    return null;
  }
}

// Save data with expiration time
async function cacheSet(key, data, ttlSeconds) {
  try {
    await redis.set(
      key,
      JSON.stringify(data),
      'EX',
      ttlSeconds
    );
  } catch (error) {
    console.error('Cache SET error:', error.message);
  }
}

// Delete data from cache
async function cacheDel(key) {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Cache DEL error:', error.message);
  }
}

module.exports = { cacheGet, cacheSet, cacheDel };
