import { Router, Request, Response, NextFunction } from "express";
import Login, { SignUp, me } from "../controllers/auth"; // Adjust the path as needed
import { errorHandler } from "../error-handler";
import authMiddleware from "../middleware/authMiddleware";
// Assuming you have a controller for user profile

const authRoutes: Router = Router();

authRoutes.post('/SignUp', errorHandler(SignUp as (req: Request, res: Response, next: NextFunction) => any)); // Route for user sign-up
authRoutes.post('/Login', errorHandler(Login as (req: Request, res: Response, next: NextFunction) => any)); // Route for user login
authRoutes.get('/me', authMiddleware, errorHandler(me as (req: Request, res: Response, next: NextFunction) => any)); // Route to get the logged-in user's profile

export default authRoutes;
// This code defines the authentication routes for the application.