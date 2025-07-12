import { HttpException } from './root';
import { ErrorCode } from './root'; // import or define errorCode type
// import { errorCode } from './path-to-errorCode-type';

export class NotFoundException extends HttpException {
    constructor(message: string, errorCode: ErrorCode, error: any) {
        super(404, message, errorCode, error);
    }
}