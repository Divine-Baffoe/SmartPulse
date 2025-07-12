// message, statusCode, error code and error
export class HttpException extends Error {
    statusCode: number;
    errorCode?: string;
    error?: any;

    constructor(statusCode: number, message: string, errorCode?: string, error?: any) {
        super(message); // <-- Only call super() ONCE
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.error = error;
        Object.setPrototypeOf(this, HttpException.prototype);
    }
}


export enum ErrorCode {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    INTERAL_EXCEPTION = 'INTERNAL_EXCEPTION',
    PROFILE_RETRIEVAL_FAILED = 'PROFILE_RETRIEVAL_FAILED',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    BAD_REQUEST = 'BAD_REQUEST',
    LOGIN_FAILED = 'LOGIN_FAILED',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
    CONFLICT = 'CONFLICT',
    TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
    GONE = 'GONE',
    LENGTH_REQUIRED = 'LENGTH_REQUIRED',
    PRECONDITION_FAILED = 'PRECONDITION_FAILED',
    PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
    URI_TOO_LONG = 'URI_TOO_LONG',
    UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',
    RANGE_NOT_SATISFIABLE = 'RANGE_NOT_SATISFIABLE',
    EXPECTATION_FAILED = 'EXPECTATION_FAILED',
    IM_A_TEAPOT = 'IM_A_TEAPOT',
    LOCKED = 'LOCKED',
    FAILED_DEPENDENCY = 'FAILED_DEPENDENCY',

}