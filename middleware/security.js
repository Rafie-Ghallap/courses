const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const mongoSanitize = require("express-mongo-sanitize");

const applySecurity = (app) => {
  // Helmet: secure headers
  app.use(helmet());

  // Rate Limit: prevent brute force
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    message: "Too many requests, try again later.",
  });
  app.use("/auth", limiter);

// Manual sanitize (fixes the "Cannot set property query" bug)
  app.use((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.query) mongoSanitize.sanitize(req.query);
    if (req.params) mongoSanitize.sanitize(req.params);
    next();
  });
};

module.exports = { applySecurity };
