import express from 'express';
import { Router } from 'express';
import authRoutes from './authRoutes'; // Import the authentication routes
import { PrismaClient } from '@prisma/client';
import UserRoutes from './User';
// This code sets up the main router for the application and includes the authentication routes.

const rootRouter: Router = express.Router();

rootRouter.use('/auth', authRoutes); // Import and use the auth routes
rootRouter.use('/User', UserRoutes); // Import and use the User routes



export default rootRouter;