import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {LoggingUtil} from "../utils/logging/logging.util";
import {AuthUtil} from "../utils/auth/auth.util";

export class Singletons {

    public static async init() {
        ErrorCodeUtil.init();
        LoggingUtil.init();
        await AuthUtil.init();

    }

}