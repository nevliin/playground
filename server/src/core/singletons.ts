import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {LoggingUtil} from "../utils/logging/logging.util";

export class Singletons {

    public static init() {
        ErrorCodeUtil.init();
        LoggingUtil.init();
    }

}