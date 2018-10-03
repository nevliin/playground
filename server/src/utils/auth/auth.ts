import {IServerConfig} from "../../config/server-config.model";
import {DBConnection} from "../dbconnection/dbconnection";
import {ISignUpModel} from "./signup.model";
import {Logger, LoggingUtil} from "../logging/logging.util";
import {OkPacket, RowDataPacket} from "mysql";

const bcrypt = require('bcryptjs');

const config: IServerConfig = require('../../config/config.json');

export class Auth {

    db: DBConnection;
    logger: Logger;

    constructor() {
        this.db = new DBConnection(config.auth);
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
            if(e.message.startsWith('ER_DUP_ENTRY')) {
                throw e;
            }
            this.logger.warn(e, 'signUp');
            return;
        }
    }



}