import {z} from 'zod';

export const RegisterSchema = z.object({
    name: z.string().min(1, 'Name is required and must be at least 1 character'),
    email: z.string().email('Invalid email format'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
            'Password must contain letters, numbers, and symbols'
        ),
    company: z.string().min(1, 'Company name is required'),
    countryCode: z.string().optional(),
    contact: z.string().optional(),
    termsAgreed: z.boolean().default(false),
    });


export const LoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),

});

export const ForgotPasswordSchema = z.object({
    email: z.string().email('Enter a valid email address'),
});

export const ResetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string()
        .min(8, 'New password must be at least 8 characters')
        .regex(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
            'New password must contain letters, numbers, and symbols'
        ),
});


export const ChangePasswordSchema = z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string()
        .min(8, 'New password must be at least 8 characters')
        .regex(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
            'New password must contain letters, numbers, and symbols'
        ),
});


export const VerifyEmailSchema = z.object({
    token: z.string().min(1, 'Token is required'),
});


export const AuthResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    token: z.string().optional(),
    user: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string().email(),
        role: z.string(),
        companyId: z.number(),
    }).optional(),
});

