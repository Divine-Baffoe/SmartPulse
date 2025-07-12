import { HttpException } from './root';
import { ErrorCode } from './root'; // import or define errorCode type
// import { errorCode } from './path-to-errorCode-type';

export class UnauthorizedException extends HttpException {
    constructor(message: string, errorCode: ErrorCode, error: any) {
        super(401, message, errorCode, error);
    }
}