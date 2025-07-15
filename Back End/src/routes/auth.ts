import express from 'express';
import { getProfile, updateProfile } from '../controllers/auth';
import authenticate from '../middleware/auth';
import User from '../models/User';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/jwt';
import { asyncHandler } from '../middleware/error';

const router = express.Router();

// OAuth callback endpoint - receives user data from Cloudflare Worker
router.post('/callback', asyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
  const { oauthId, email, firstName, lastName } = req.body;

  if (!oauthId || !email || !firstName || !lastName) {
    res.status(400).json({ 
      error: 'Missing required OAuth data',
      required: ['oauthId', 'email', 'firstName', 'lastName']
    });
    return;
  }

  // Find existing user or create new one
  let user = await User.findOne({ oauthId });
  
  if (!user) {
    // Check if user exists with same email (account linking)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Link OAuth to existing account
      existingUser.oauthId = oauthId;
      user = await existingUser.save();
    } else {
      // Create new user
      user = await User.create({
        oauthId,
        email,
        firstName,
        lastName,
        role: 'customer',
        language: 'en',
        currency: 'USD',
        isActive: true
      });
    }
  } else {
    // Update user info from OAuth (in case it changed)
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    await user.save();
  }

  // Generate JWT and set HTTP-only cookie
  const token = generateToken(user);
  setTokenCookie(res, token);

  res.json({
    message: 'Authentication successful',
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      language: user.language,
      currency: user.currency
    }
  });
}));

// Test endpoint to verify server updates
router.get('/test', (req: express.Request, res: express.Response): void => {
  res.json({ message: 'Server updated successfully!', timestamp: new Date().toISOString() });
});

// Logout endpoint
router.post('/logout', (req: express.Request, res: express.Response): void => {
  clearTokenCookie(res);
  res.json({ message: 'Logged out successfully' });
});

// Password-based login
router.post('/login', asyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
  console.log('LOGIN ENDPOINT HIT - NEW CODE WORKING!', { email: req.body.email, password: req.body.password });
  
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ 
      error: 'Email and password are required'
    });
    return;
  }

  // Quick demo login for testing - Admin
  if (email === 'admin@vidarentals.com' && password === 'admin123') {
    console.log('ADMIN LOGIN DETECTED - SHOULD WORK!');
    // Find or create admin user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email: 'admin@vidarentals.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        language: 'en',
        currency: 'USD',
        isActive: true
      });
    }

    // Generate JWT and set HTTP-only cookie
    const token = generateToken(user);
    setTokenCookie(res, token);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        language: user.language,
        currency: user.currency,
        commissionRate: user.commissionRate
      }
    });
    return;
  }

  // Quick demo login for testing - Reseller
  if (email === 'reseller@vidarentals.com' && password === 'reseller123') {
    console.log('RESELLER LOGIN DETECTED - SHOULD WORK!');
    // Find or create reseller user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email: 'reseller@vidarentals.com',
        password: 'reseller123',
        firstName: 'Reseller',
        lastName: 'Partner',
        role: 'reseller',
        language: 'en',
        currency: 'USD',
        isActive: true,
        commissionRate: 15 // 15% commission rate for reseller
      });
    }

    // Generate JWT and set HTTP-only cookie
    const token = generateToken(user);
    setTokenCookie(res, token);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        language: user.language,
        currency: user.currency,
        commissionRate: user.commissionRate
      }
    });
    return;
  }

  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !user.password) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  // Check password
  const isValidPassword = await user.comparePassword(password);
  
  if (!isValidPassword) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  // Generate JWT and set HTTP-only cookie
  const token = generateToken(user);
  setTokenCookie(res, token);

  res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      language: user.language,
      currency: user.currency,
      commissionRate: user.commissionRate
    }
  });
}));

// Password-based registration
router.post('/register', asyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ 
      error: 'Email, password, first name, and last name are required'
    });
    return;
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ error: 'User with this email already exists' });
    return;
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    role: 'customer',
    language: 'en',
    currency: 'USD',
    isActive: true
  });

  // Generate JWT and set HTTP-only cookie
  const token = generateToken(user);
  setTokenCookie(res, token);

  res.status(201).json({
    message: 'Registration successful',
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      language: user.language,
      currency: user.currency
    }
  });
}));

// Debug endpoint to check users (REMOVE IN PRODUCTION)
router.get('/debug/users', asyncHandler(async (req: express.Request, res: express.Response): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ error: 'Debug endpoint not available in production' });
    return;
  }
  
  const users = await User.find({}).select('+password');
  res.json({ users: users.map(u => ({ email: u.email, hasPassword: !!u.password, passwordLength: u.password?.length })) });
}));

// Protected routes
router.get('/me', authenticate, getProfile);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;