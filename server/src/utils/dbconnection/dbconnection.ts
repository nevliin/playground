import * as mysql from "mysql";
import {OkPacket, Pool} from "mysql";
import {createConnection, QueryError, RowDataPacket} from 'mysql';
import {IDBConfig, IServerConfig} from "../../config/server-config.model";

const config: IServerConfig = require('../../config/config.json');

export class DBConnection {

    private pool: Pool;

    constructor(dbconfig?: IDBConfig) {
        if(dbconfig) {
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

    async query(query: string): Promise<RowDataPacket[]> {
        return new Promise<RowDataPacket[]>(((resolve, reject) => {
            this.pool.query(query, (err: QueryError, rows: RowDataPacket[]) => {
                if(err) {
                    reject(err);
                }
                resolve(rows);
            });
        }));
    }

    async insert(query: string): Promise<OkPacket> {
        return new Promise<OkPacket>(((resolve, reject) => {
            this.pool.query(query, (err: QueryError, result: OkPacket) => {
                if(err) {
                    reject(err);
                }
                resolve(result);
            });
        }));
    }

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
                    return "\\"+char; // prepends a backslash to backslash, percent,
                                      // and double/single quotes
            }
        });
    }
}
/* Usage example:

var connection = require('../middleware/db');

function get_active_sessions(){
  connection.query('Select * from `sessions` where `Active`=1 and Expires>?;', [~~(new Date()/1000)], function(err, results){
    if(err){
      console.log(err);
    }
    else{
      console.log(results);
    }
  });
}
 */