// __tests__/validate.test.js
const { sanitizeBody, requireFields, validateEmail, validateEnum, validateRange, validateObjectId, parsePagination } = require('../middleware/validate');

// Helper to create mock req/res/next
const mockReqResNext = (body = {}, params = {}, query = {}) => {
  const req = { body, params, query };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
  const next = jest.fn();
  return { req, res, next };
};

describe('validate middleware', () => {
  describe('sanitizeBody', () => {
    it('trims and removes angle brackets from strings', () => {
      const { req, res, next } = mockReqResNext({ name: '  <script>alert</script>  ' });
      sanitizeBody(req, res, next);
      expect(req.body.name).toBe('scriptalert/script');
      expect(next).toHaveBeenCalled();
    });

    it('handles nested objects', () => {
      const { req, res, next } = mockReqResNext({ user: { name: '<b>test</b>' } });
      sanitizeBody(req, res, next);
      expect(req.body.user.name).toBe('btest/b');
      expect(next).toHaveBeenCalled();
    });

    it('handles arrays', () => {
      const { req, res, next } = mockReqResNext({ items: ['<script>', 'normal'] });
      sanitizeBody(req, res, next);
      expect(req.body.items[0]).toBe('script');
      expect(req.body.items[1]).toBe('normal');
      expect(next).toHaveBeenCalled();
    });

    it('does nothing with empty body', () => {
      const { req, res, next } = mockReqResNext();
      sanitizeBody(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireFields', () => {
    it('passes when all fields present', () => {
      const { req, res, next } = mockReqResNext({ name: 'John', email: 'john@test.com' });
      requireFields('name', 'email')(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('returns 400 when fields missing', () => {
      const { req, res, next } = mockReqResNext({ name: 'John' });
      requireFields('name', 'email')(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('treats empty string as missing', () => {
      const { req, res, next } = mockReqResNext({ name: '' });
      requireFields('name')(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateEmail', () => {
    it('passes with valid email', () => {
      const { req, res, next } = mockReqResNext({ email: 'test@example.com' });
      validateEmail(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('fails with invalid email', () => {
      const { req, res, next } = mockReqResNext({ email: 'invalid' });
      validateEmail(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('passes when no email field', () => {
      const { req, res, next } = mockReqResNext({});
      validateEmail(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateEnum', () => {
    it('passes with valid value', () => {
      const { req, res, next } = mockReqResNext({ role: 'admin' });
      validateEnum('role', ['admin', 'waiter', 'chef'])(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('fails with invalid value', () => {
      const { req, res, next } = mockReqResNext({ role: 'customer' });
      validateEnum('role', ['admin', 'waiter', 'chef'])(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateRange', () => {
    it('passes with value in range', () => {
      const { req, res, next } = mockReqResNext({ price: 10 });
      validateRange('price', 0.01, 10000)(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('fails with value out of range', () => {
      const { req, res, next } = mockReqResNext({ price: -5 });
      validateRange('price', 0.01, 10000)(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateObjectId', () => {
    it('passes with valid ObjectId', () => {
      const { req, res, next } = mockReqResNext({}, { id: '507f1f77bcf86cd799439011' });
      validateObjectId()(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('fails with invalid ObjectId', () => {
      const { req, res, next } = mockReqResNext({}, { id: 'invalid-id' });
      validateObjectId()(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('parsePagination', () => {
    it('parses page and limit from query', () => {
      const { req, res, next } = mockReqResNext({}, {}, { page: '2', limit: '10' });
      parsePagination(req, res, next);
      expect(req.pagination).toEqual({ page: 2, limit: 10, skip: 10 });
      expect(next).toHaveBeenCalled();
    });

    it('defaults to page 1 limit 20', () => {
      const { req, res, next } = mockReqResNext({}, {}, {});
      parsePagination(req, res, next);
      expect(req.pagination).toEqual({ page: 1, limit: 20, skip: 0 });
    });

    it('clamps limit to max 100', () => {
      const { req, res, next } = mockReqResNext({}, {}, { limit: '500' });
      parsePagination(req, res, next);
      expect(req.pagination.limit).toBe(100);
    });
  });
});
