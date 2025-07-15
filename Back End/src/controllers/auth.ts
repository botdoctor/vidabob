import { Request, Response } from 'express';
// import bcrypt from 'bcrypt'; // Temporarily disabled for development
import User from '../models/User';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role = 'customer' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email already exists',
      });
      return;
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user);
    
    // Set HTTP-only cookie
    setTokenCookie(res, token);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Registration failed',
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username, role } = req.body;
    
    // Support both email and username login
    const loginField = email || username;
    const query = email ? { email: loginField } : { username: loginField };
    
    console.log('Login attempt:', { loginField, role });

    // Find user by email or username
    const user = await User.findOne(query);
    console.log('User found:', user ? (user.email || user.username) : 'No user');
    
    if (!user) {
      console.log('User not found for:', loginField);
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect',
      });
      return;
    }

    // Check role if specified (for admin/reseller separation)
    if (role && user.role !== role) {
      console.log('Role mismatch:', { expected: role, actual: user.role });
      res.status(403).json({
        error: 'Access denied',
        message: `This login is for ${role}s only`,
      });
      return;
    }

    // Check password (using User model method)
    console.log('Checking password:', { provided: password, stored: user.password });
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Password mismatch for user:', loginField);
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect',
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user);
    
    // Set HTTP-only cookie
    setTokenCookie(res, token);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        language: user.language,
        currency: user.currency,
        commissionRate: user.commissionRate,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Login failed',
      message: error.message,
    });
  }
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User profile not found',
      });
      return;
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        commissionRate: user.commissionRate,
        totalCommissions: user.totalCommissions,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get profile',
      message: error.message,
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear HTTP-only cookie
    clearTokenCookie(res);
    
    res.json({
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Logout failed',
      message: error.message,
    });
  }
};

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User profile not found',
      });
      return;
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        commissionRate: user.commissionRate,
        totalCommissions: user.totalCommissions,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message,
    });
  }
};

export const changePassword = async (req: any, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User profile not found',
      });
      return;
    }

    // Verify current password (using User model method)
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        error: 'Invalid password',
        message: 'Current password is incorrect',
      });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to change password',
      message: error.message,
    });
  }
};