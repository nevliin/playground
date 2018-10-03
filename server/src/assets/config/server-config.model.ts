export interface IServerConfig {
    jwtsecret: string;
    db: IDBConfig;
    auth: IDBConfig;
}

export interface IDBConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}