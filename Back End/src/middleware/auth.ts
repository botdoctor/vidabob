import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { verifyToken, extractToken } from '../utils/jwt';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({
        error: 'Access denied',
        message: 'No token provided',
      });
      return;
    }

    // Handle temporary admin token for development
    if (token === 'dummy-token-admin-temp' && process.env.NODE_ENV === 'development') {
      req.user = {
        id: 'admin-temp',
        email: 'admin@vidarentals.com',
        role: 'admin',
      };
      next();
      return;
    }

    // Verify JWT token
    const decoded = verifyToken(token);
    
    // Verify user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({
        error: 'Access denied',
        message: 'User not found',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Access denied',
      message: 'Invalid token',
    });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Access denied',
        message: 'Not authenticated',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required roles: ${roles.join(', ')}`,
      });
      return;
    }

    next();
  };
};

export default authenticate;