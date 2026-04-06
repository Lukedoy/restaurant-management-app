const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      clean[key] = value.map(v => typeof v === 'object' ? sanitizeObject(v) : sanitizeString(v));
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value);
    } else {
      clean[key] = sanitizeString(value);
    }
  }
  return clean;
};

exports.sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};

exports.requireFields = (...fields) => (req, res, next) => {
  const missing = fields.filter(f => req.body[f] === undefined || req.body[f] === '');
  if (missing.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missing.join(', ')}`
    });
  }
  next();
};

exports.validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  next();
};

exports.validateEnum = (field, allowed) => (req, res, next) => {
  const value = req.body[field];
  if (value && !allowed.includes(value)) {
    return res.status(400).json({
      message: `Invalid ${field}. Allowed values: ${allowed.join(', ')}`
    });
  }
  next();
};

exports.validateRange = (field, min, max) => (req, res, next) => {
  const value = Number(req.body[field]);
  if (req.body[field] !== undefined && (isNaN(value) || value < min || value > max)) {
    return res.status(400).json({
      message: `${field} must be a number between ${min} and ${max}`
    });
  }
  next();
};

exports.validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ message: `Invalid ${paramName} format` });
  }
  next();
};

exports.parsePagination = (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  req.pagination = { page, limit, skip: (page - 1) * limit };
  next();
};
