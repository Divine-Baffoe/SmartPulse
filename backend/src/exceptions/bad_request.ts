import { HttpException } from "./root";

export class BadRequestException extends HttpException {
    statusCode: number;
    message: string;

    constructor(message: string, ErrorCode?: any) {
        super(400, message, ErrorCode, null);
        this.statusCode = 400; // HTTP status code for Bad Request
        this.message = message;
        this.name = 'BadRequestException';
        Object.setPrototypeOf(this, BadRequestException.prototype);
    }
}