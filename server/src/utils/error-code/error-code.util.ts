import {Response} from "express";
import {IErrorCode} from "../../assets/error-codes/error-codes.model";
import {Logger, LoggingUtil} from "../logging/logging.util";

/**
 * Utility for easily returning meaningful error codes to the client
 */
export class ErrorCodeUtil {
    static errors: IErrorCode[] = [];
    static logger: Logger;

    /**
     * Initialize singleton
     */
    static init() {
        this.logger = LoggingUtil.getLogger('ErrorCodeUtil');
        this.errors = require('../../assets/error-codes/error-codes.json');
    }

    /**
     * Find the error code for the given identifier and throw it; will find the error code for an Error if the message
     * starts with the error code's name; throws error code 0 if none match
     * @param identifier
     */
    static findErrorCodeAndThrow(identifier: number | string | Error) {
        if (typeof identifier === 'string') {
            const errorCode: IErrorCode = this.errors.find(value => value.name === identifier);
            if (errorCode) {
                throw new ErrorWithCode(errorCode.id);
            }
        }
        if (typeof identifier === 'number') {
            const errorCode: IErrorCode = this.errors.find(value => value.id === identifier);
            if (errorCode) {
                throw new ErrorWithCode(errorCode.id);
            }
        }
        if (identifier instanceof Error) {
            const errorCode: IErrorCode = this.errors.find(value => identifier.message.startsWith(value.name));
            if (errorCode) {
                throw new ErrorWithCode(errorCode.id);
            }
        }
        throw new ErrorWithCode(0);
    }

    /**
     * Find the error code for the given identifier and return it; will find the error code for an Error if the message
     * starts with the error code's name; returns error code 0 if none match
     * @param identifier
     */
    static findErrorCode(identifier: number | string | Error): ErrorWithCode {
        if (typeof identifier === 'string') {
            const errorCode: IErrorCode = this.errors.find(value => value.name === identifier);
            if (errorCode) {
                return new ErrorWithCode(errorCode.id);
            }
        }
        if (typeof identifier === 'number') {
            const errorCode: IErrorCode = this.errors.find(value => value.id === identifier);
            if (errorCode) {
                return new ErrorWithCode(errorCode.id);
            }
        }
        if (identifier instanceof Error) {
            const errorCode: IErrorCode = this.errors.find(value => identifier.message.startsWith(value.name));
            if (errorCode) {
                return new ErrorWithCode(errorCode.id);
            }
        }
        return new ErrorWithCode(0);
    }

    /**
     * Checks if the provided Error is of type ErrorWithCode
     * @param e
     */
    static isErrorWithCode(e: Error): boolean {
        return e instanceof ErrorWithCode;
    }

    /**
     * Returns the provided error via the given response
     * @param e
     * @param res
     */
    static resolveErrorOnRoute(e: Error, res: Response) {
        if(ErrorCodeUtil.isErrorWithCode(e)) {
            res.status(900).send(e);
        } else {
            this.logger.error(e, 'resolveErrorOnRoute');
            res.status(500).send({
                error: this.findErrorCode(0).message
            });
        }
    }
}

/**
 * Extension of Error with the id of the error code
 */
class ErrorWithCode extends Error {

    id: number;

    constructor(id: number) {
        super();
        super.message = ErrorCodeUtil.errors.find(value => value.id === id).text;
        this.id = id;
    }

}