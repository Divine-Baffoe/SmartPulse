import {z} from 'zod';

export const SignUpSchema = z.object({
    
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
            'Password must contain letters, numbers, and symbols'
        ),
    company: z.string().min(2, 'Company name is required'),
    countryCode: z.string().optional(),
    contact: z.string().optional(),
    termsAgreed: z.boolean().default(false),
}); 