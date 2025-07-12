import { HttpException} from "./root";

export class InternalException extends HttpException {
    constructor(message: string, errorCode?: string, error?: any) {
        super(500, message, errorCode, error);
    }
}