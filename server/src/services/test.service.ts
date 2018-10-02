import {DBConnection} from "../utils/dbconnection/dbconnection";

export class TestService {

    db: DBConnection;

    constructor() {
        this.db = new DBConnection();
    }

    async getTest(): Promise<string> {
        const result: string = await this.db.query('SELECT username FROM auth_users LIMIT 1;');
        return result;
    }

}