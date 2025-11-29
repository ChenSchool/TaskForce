/**
 * Rate limiting middleware module.
 * Provides configurable rate limiters for different endpoint types to prevent abuse and ensure API stability.
 */
import rateLimit from 'express-rate-limit';

/**
 * General rate limiter - 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      message: 'Too many requests from this IP, please try again later.'
    });
  }
});

/**
 * Strict rate limiter for authentication endpoints - 5 requests per 15 minutes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many login attempts from this IP, please try again after 15 minutes.',
      message: 'Too many login attempts from this IP, please try again after 15 minutes.'
    });
  }
});

/**
 * Moderate rate limiter for create/update operations - 30 requests per 15 minutes
 */
export const createUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 create/update requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many create/update requests, please slow down.',
      message: 'Too many create/update requests, please slow down.'
    });
  }
});

/**
 * Lenient rate limiter for read operations - 200 requests per 15 minutes
 */
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 read requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests, please try again later.',
      message: 'Too many requests, please try again later.'
    });
  }
});
