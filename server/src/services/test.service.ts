import {DbUtil} from "../utils/db/db.util";
import {RowDataPacket} from "mysql";

export class TestService {

    db: DbUtil;

    constructor() {
        this.db = new DbUtil();
    }

    async getTest(): Promise<string> {
        const result: RowDataPacket[] = await this.db.query('SELECT username FROM auth_user LIMIT 1;');
        if(result.length > 0) {
            return result[0]['username'];
        }
        return 'None exist';
    }

}