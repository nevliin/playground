import {Response} from "express";

export class ErrorCodeUtil {
    static errors: ErrorCode[] = [];

    static init() {
        this.errors = require('../../assets/error-codes/error-codes.json');
    }

    static findErrorCodeAndThrow(identifier: number | string | Error) {
        if (typeof identifier === 'string') {
            const errorCode: ErrorCode = this.errors.find(value => value.name === identifier);
            if (errorCode) {
                throw new ErrorWithCode(errorCode.id);
            }
        }
        if (typeof identifier === 'number') {
            const errorCode: ErrorCode = this.errors.find(value => value.id === identifier);
            if (errorCode) {
                throw new ErrorWithCode(errorCode.id);
            }
        }
        if (identifier instanceof Error) {
            const errorCode: ErrorCode = this.errors.find(value => identifier.message.startsWith(value.name));
            if (errorCode) {
                throw new ErrorWithCode(errorCode.id);
            }
        }
        throw new ErrorWithCode(0);
    }

    static isErrorWithCode(e: Error): boolean {
        return e instanceof ErrorWithCode;
    }

    static resolveErrorOnRoute(e: Error, res: Response) {
        if(ErrorCodeUtil.isErrorWithCode(e)) {
            res.status(900).send(e);
        } else {
            res.status(500).send({
                error: e.message
            });
        }
    }
}

class ErrorCode {
    id: number;
    name: string;
    text: string;
}

class ErrorWithCode extends Error {

    id: number;

    constructor(id: number) {
        super();
        super.message = ErrorCodeUtil.errors.find(value => value.id === id).text;
        this.id = id;
    }

}