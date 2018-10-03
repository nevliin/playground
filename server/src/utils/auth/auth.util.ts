import {IServerConfig} from "../../assets/config/server-config.model";
import {DbUtil} from "../dbconnection/db.util";
import {ISignUpModel} from "./signup.model";
import {Logger, LoggingUtil} from "../logging/logging.util";
import {OkPacket, RowDataPacket} from "mysql";
import {ErrorCodeUtil} from "../error-code/error-code.util";
import {ILoginModel} from "./login.model";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config: IServerConfig = require('../../assets/config/server-config.json');

export class AuthUtil {

    db: DbUtil;
    logger: Logger;

    constructor() {
        this.db = new DbUtil(config.auth);
        this.logger = LoggingUtil.getLogger('auth');
    }

    /**
     * Creates a user with the provided credentials, returns the user id
     * @param signUpModel
     */
    public async signUp(signUpModel: ISignUpModel): Promise<number> {
        const hash: string = await bcrypt.hash(signUpModel.password, 10);

        try {
            const result: OkPacket = await this.db.insert(`INSERT INTO auth_users(username, passwordhash) VALUES('${this.db.esc(signUpModel.username)}', '${hash}');`)
            return result.insertId;
        } catch (e) {
            ErrorCodeUtil.findErrorCodeAndThrow(e);
            this.logger.error(e, 'signUp');
        }
    }

    public async login(loginModel: ILoginModel): Promise<string> {
        try {
            const result: RowDataPacket[] = await this.db.query(`SELECT passwordhash FROM auth_users WHERE username = '${loginModel.username}';`)
            if (!!result[0].passwordhash) {
                if(bcrypt.compareSync(loginModel.password, result[0].passwordhash)) {
                    const token: string = jwt.sign({
                            username: loginModel.username
                        },
                        config.jwtsecret,
                        {
                            expiresIn: '30d'
                        }
                    );
                    return token;
                } else {
                    ErrorCodeUtil.findErrorCodeAndThrow('INCORRECT_CREDENTIALS');
                }
            } else {
                ErrorCodeUtil.findErrorCodeAndThrow('NO_SUCH_USER');
            }
        } catch (e) {
            throw e;
        }
    }


}