import { Request, Response, NextFunction } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import { hashSync, compareSync } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { BadRequestException } from '../exceptions/bad_request';
import { ErrorCode } from '../exceptions/root';
import { UnprocessableEntityException } from '../exceptions/validation';    
import { SignUpSchema } from '../schema/user';
import { NotFoundException } from '../exceptions/not-found';
import { JWT_SECRET } from '../Secrets';

const prismaClient = new PrismaClient();

const SignUp = async (req: Request, res: Response, next: NextFunction ) => {
    SignUpSchema.parse(req.body);
    const { name, email, password, company, contact, countrycode, termsAgreed } = req.body;

    // Check if user already exists
    let existingUser = await prismaClient.user.findFirst({ 
        where: { email: email }
    });

    if (existingUser) {
        throw new BadRequestException('User already exists', ErrorCode.USER_ALREADY_EXISTS);
    }

    try {
        // Check if company exists
        let companyRecord = await prismaClient.company.findFirst({
            where: { name: company }
        });

        let role: UserRole = UserRole.EMPLOYEE; // default role

        if (!companyRecord) {
            // Company does not exist, create it
            companyRecord = await prismaClient.company.create({
                data: { name: company }
            });
            role = UserRole.ADMIN;
        } else {
            // Company exists, check if it has any users
            const userCount = await prismaClient.user.count({
                where: { companyId: companyRecord.id }
            });
            if (userCount === 0) {
                role = UserRole.ADMIN;
            }
        }

        // Create the user and connect to the company by id
        const newUser = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10),
                company: { connect: { id: companyRecord.id } },
                contact,
                countrycode: countrycode, // Use the correct variable
                termsAgreed,              // Use value from request body
                role
            }
        });

        return res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
    } catch (error) {
         next(new UnprocessableEntityException('Failed to create user', ErrorCode.VALIDATION_ERROR, error));
    }
};

export { SignUp };
// Export the SignUp function to be used in routes


//Login Authentication for users and admins

const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await prismaClient.user.findUnique({
            where: { email }, 
            include: { company: true }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Incorrect email or username' });
        }

        // Check password
        if (!compareSync(password, user.password)) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }

        // Return user data without password
        const { password: _, ...userData } = user;

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET || 'default_secret',
            { expiresIn: '1h' }
        );

        // Return user data with all needed fields
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                avatarUrl: user.avatarUrl,
                email: user.email,
                companyId: user.companyId,
                companyName: user.company.name,
                role: user.role,
                contact: user.contact,
                countrycode: user.countrycode,
                // add any other fields you need here
            },
            token
        });
        
    } catch (error) {
        next(new BadRequestException('Login failed', ErrorCode.LOGIN_FAILED));
    }
};

export default Login;


// /me -> Get user profile/ return the logged in user

const me = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
        return next(new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND, null));
    }

    try {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            include: { company: true }
        });

        if (!user) {
            return next(new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND, null));
        }

        const { password: _, ...userData } = user;

        return res.status(200).json({ success: true, user: userData });
    } catch (error) {
        next(new BadRequestException('Failed to retrieve user profile', ErrorCode.PROFILE_RETRIEVAL_FAILED));
    }
};

export { me };