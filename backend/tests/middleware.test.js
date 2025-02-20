const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { authenticateJWT, generatePasswordResetToken, generateToken, globalRateLimiter, userRateLimiter } = require('../middleware'); // Adjust path as needed
const JWT_SECRET = process.env.JWT_SECRET;

describe('generatePasswordResetToken', () => {
    it('should generate a valid password reset token', () => {
        const userId = 1;
        
        const token = generatePasswordResetToken(userId);

        // Check if the token is valid
        const decoded = jwt.verify(token, JWT_SECRET);
        expect(decoded.id).toBe(userId);
    });
});


describe('generateToken', () => {
    it('should generate a valid token with user info', () => {
        const user = { id: 1, firstName: 'John', lastName: 'Doe', role: 'admin' };

        const token = generateToken(user);

        // Check if the token is valid
        const decoded = jwt.verify(token, JWT_SECRET);
        expect(decoded.id).toBe(user.id);
        expect(decoded.firstName).toBe(user.firstName);
        expect(decoded.lastName).toBe(user.lastName);
        expect(decoded.role).toBe(user.role);
    });
});


describe('authenticateJWT Middleware', () => {
    it('should return 401 if no token is provided', async () => {
        const req = { headers: {} }; // No token
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        await authenticateJWT(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token required' });
    });

    it('should return 403 if token is invalid', async () => {
        const req = { headers: { authorization: 'Bearer invalid-token' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        jwt.verify = jest.fn().mockImplementation(() => { throw new Error('Invalid token'); });

        await authenticateJWT(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    });

    it('should return 403 if the user is not found or is disabled', async () => {
        const req = { headers: { authorization: 'Bearer valid-token' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        jwt.verify = jest.fn().mockReturnValue({ id: 1 }); // Mock a valid token
        User.findById = jest.fn().mockResolvedValue(null); // Mock user not found or disabled

        await authenticateJWT(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'User account is disabled or deleted' });
    });

    it('should call next if the token is valid and user is active', async () => {
        const req = { headers: { authorization: 'Bearer valid-token' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        const mockUser = { id: 1, isEnable: true };
        jwt.verify = jest.fn().mockReturnValue({ id: 1 });
        User.findById = jest.fn().mockResolvedValue(mockUser);

        await authenticateJWT(req, res, next);

        expect(req.userFromToken).toBe(mockUser);
        expect(next).toHaveBeenCalled();
    });


});

describe('globalRateLimiter Middleware', () => {
    beforeEach(() => {
        globalRequestCount = 0; // Reset before each test
    });

    it('should allow requests if the limit is not exceeded', async () => {
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Simulate that the total requests haven't been exceeded
        await globalRateLimiter(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should reject requests if the global request limit is exceeded', async () => {
        globalRequestCount = 200; // Set to max limit

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        await globalRateLimiter(req, res, next);

        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledWith({ message: 'Too many requests, please try again later.' });
        expect(next).not.toHaveBeenCalled();
    });
});

describe('userRateLimiter Middleware', () => {
    it('should allow requests within the rate limit', async () => {
        const req = { headers: { 'x-user-id': '123', path: '/test' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Simulate that the user has not exceeded the rate limit
        userRateLimiter(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should reject requests if the user exceeds the rate limit', async () => {
        const req = { headers: { 'x-user-id': '123', path: '/test' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // Simulate that the rate limit was exceeded for the user
        userRateLimiter(req, res, next);

        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledWith({ message: 'Too many requests, please try again later.' });
        expect(next).not.toHaveBeenCalled();
    });
});
