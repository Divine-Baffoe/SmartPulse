export interface User {
    id: number;
    name: string;
    email: string;
    isVerified: boolean;
    password: string;
    verificationToken?: string;
    verificationTokenExpiry?: Date;
    resetpasswordToken?: string;
    resetpasswordTokenExpiry?: Date;
    role: string;
    countrycode: string;
    contact: string;
    companyId: number;
    termsAgreed: boolean;
    createdAt: Date;
    updatedAt: Date;
}


export interface RegisterUserInput {
    name: string;
    email: string;
    password: string;
    company: string;
    countryCode: string;
    contact: string;
    termsAgreed: boolean;
}

export interface LoginUserInput {
    email: string;
    password: string;
}


export interface ForgotPassword {
    email: string;
}


export interface ResetPasswordInput {
    token: string;
    newPassword: string;
}

export interface changePasswordInput {
    oldPassword: string;
    newPassword: string;
}

export interface VerifyEmailInput {
    token: string;
}


export interface AuthResponse {
     success: boolean;
     message: string;
     token?: string;
     User ?: Omit<User, 'password' | 'verificationToken' | 'verificationTokenExpiry' | 'resetpasswordToken' | 'resetpasswordTokenExpiry'>;
}


export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    countrycode: string;
    contact: string;
    companyId: number;
    termsAgreed: boolean;
    createdAt: Date;
    updatedAt: Date;
}