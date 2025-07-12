// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; // <-- Add this import
import { JWT_SECRET } from '../Secrets'; // Make sure this exports a string with a fallback
import { UnauthorizedException } from '../exceptions/unathourised';
import { ErrorCode } from '../exceptions/root';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token  = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
  if (!token) {
    return next(new UnauthorizedException('No token provided', ErrorCode.UNAUTHORIZED, null));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number };
    // Check if the user exists in the database
    const user = await prisma.user.findFirst({
      where: { id: payload.id },
    });

    if (!user) {
      return next(new UnauthorizedException('User not found', ErrorCode.UNAUTHORIZED, null));
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (error) {
    return next(new UnauthorizedException('Invalid token', ErrorCode.UNAUTHORIZED, null));
  }
};

export default authMiddleware;