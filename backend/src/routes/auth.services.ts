import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {sendEmail, EmailOptions} from "../utils/emailServices"; // Import the email service utility

import {
    RegisterUserInput,
    LoginUserInput, 
    ForgotPassword,
    ResetPasswordInput,
    changePasswordInput,
    VerifyEmailInput,
} from "../routes/auth.types";


const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h"; // Default expiration time for JWT

const generateToken = (UserId: number) => { 
    return jwt.sign({ UserId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION } as jwt.SignOptions);
    };

//Register a new user
export const registerUser = async (input: RegisterUserInput) => {
    // Validate input fields here if necessary
    const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
    });
    if (existingUser) {
        throw new Error("Email already registered");
    }
    const { name, email, password, company, countryCode, contact: contact, termsAgreed } = input;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            countrycode: countryCode,
            contact: contact,
            companyId: Number(company),
            termsAgreed,
        },
    });



// Generate a verification token
const verificationToken = crypto.randomBytes(32).toString("hex");

// Optionally, save the verification token to the user in the database for later verification
await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken },
});

//send verification email
const emailOptions: EmailOptions = {
    to: user.email,
    subject: "Email Verification",
    html: `<p>Click <a href="http://localhost:3000/verify-email?token=${verificationToken}">here</a> to verify your email.</p>`,
};
try {
    await sendEmail(emailOptions);
} catch (error) {
    throw new Error("Failed to send verification email");
}
// Generate a JWT token for the user
const token = generateToken(user.id);
return { success: true, message: "User registered successfully", token, user };

};


//Login a user
export const loginUser = async (input: LoginUserInput) => {
    const { email, password } = input;
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            countrycode: true,
            contact: true,
            companyId: true,
            role: true,
            termsAgreed: true,
            avatarUrl: true,
            inviteToken: true,
            verificationToken: true,
            verificationTokenExpiry: true,
            createdAt: true,
            updatedAt: true,
            isVerified: true, // Ensure this field is selected
        },
    });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    if (!user.isVerified) {
        throw new Error("Email not verified");
    }
    const token = generateToken(user.id);
    return { success: true, message: "Login successful", token, user };
};