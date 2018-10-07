import * as mysql from "mysql";
import {OkPacket, Pool} from "mysql";
import {QueryError, RowDataPacket} from 'mysql';
import {IDBConfig, IServerConfig} from "../../assets/config/server-config.model";

const config: IServerConfig = require('../../assets/config/server-config.json');

/**
 * Utility for interacting with a MySQL database
 */
export class DbUtil {

    private pool: Pool;

    /**
     * Create the db pool; uses database credentials from configs if none are provided
     * @param dbconfig
     */
    constructor(dbconfig?: IDBConfig) {
        if (dbconfig) {
            this.pool = mysql.createPool({
                host: dbconfig.host,
                user: dbconfig.user,
                password: dbconfig.password,
                database: dbconfig.database,
                port: 3306
            });
        } else {
            this.pool = mysql.createPool({
                host: config.db.host,
                user: config.db.user,
                password: config.db.password,
                database: config.db.database,
                port: 3306
            });
        }
    }

    /**
     * Execute a query
     * @param query
     */
    async query(query: string): Promise<RowDataPacket[]> {
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            this.pool.query(query, (err: QueryError, rows: RowDataPacket[]) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        }));
    }

    /**
     * Execute an insertion
     * @param query
     */
    async execute(query: string): Promise<OkPacket> {
        return new Promise<OkPacket>(((resolve, reject) => {
            this.pool.query(query, (err: QueryError, result: OkPacket) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        }));
    }

    /**
     * Escape a string to make it safe for the usage in a SQL query
     * @param str
     */
    esc(str: string) {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\" + char; // prepends a backslash to backslash, percent,
                                        // and double/single quotes
            }
        });
    }
}