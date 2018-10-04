import {IServerConfig} from "../../assets/config/server-config.model";
import {DbUtil} from "../dbconnection/db.util";
import {ISignUpModel} from "./signup.model";
import {Logger, LoggingUtil} from "../logging/logging.util";
import {OkPacket, RowDataPacket} from "mysql";
import {ErrorCodeUtil} from "../error-code/error-code.util";
import {ILoginModel} from "./login.model";
import {IJWTPayloadModel} from "./jwtpayload.model";
import {IRoutePermission} from "../../assets/route-permissions/route-permissions";
import {RouteWithPermissionsModel} from "./route-with-permissions.model";
import {NextFunction, Request, Response} from "express";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config: IServerConfig = require('../../assets/config/server-config.json');
const routePermissions: IRoutePermission = require('../../assets/route-permissions/route-permissions.json');

export class AuthUtil {

    static db: DbUtil;
    static logger: Logger;
    static routePermissions: Map<string, RouteWithPermissionsModel> = new Map();

    static async init() {
        this.db = new DbUtil(config.auth);
        this.logger = LoggingUtil.getLogger('auth');
        await this.initRoutePermissions();
    }

    /**
     * Creates a user with the provided credentials, returns the user id
     * @param signUpModel
     */
    public static async signUp(signUpModel: ISignUpModel): Promise<number> {
        const hash: string = await bcrypt.hash(signUpModel.password, 10);

        try {
            const result: OkPacket = await this.db.insert(`INSERT INTO auth_user(username, salted_hash) VALUES('${this.db.esc(signUpModel.username)}', '${hash}');`)
            return result.insertId;
        } catch (e) {
            ErrorCodeUtil.findErrorCodeAndThrow(e);
            this.logger.error(e, 'signUp');
        }
    }

    public static async login(loginModel: ILoginModel): Promise<string> {
        try {
            const rows: RowDataPacket[] = await this.db.query(`SELECT id, salted_hash FROM auth_user WHERE username = '${loginModel.username}';`)
            if (!!rows[0].salted_hash && !!rows[0].id) {
                if (bcrypt.compareSync(loginModel.password, rows[0].salted_hash)) {
                    const token: string = jwt.sign({
                            userId: rows[0].id
                        },
                        config.jwtsecret,
                        {
                            expiresIn: '30d'
                        }
                    );
                    const result: OkPacket = await this.db.insert(`INSERT INTO auth_token(user_id, token) VALUES(${rows[0].id}, '${token}');`);
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

    static routeGuard = async function (req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.path);
            if(!AuthUtil.isRouteGuarded(req.path)) {
                next();
            }
            if (req.get('auth-token')) {
                const userId: number = await AuthUtil.verifyToken(req.get('auth-token'));
                if(AuthUtil.verifyRoutePermission(req.path, userId)) {
                    next();
                } else {
                    ErrorCodeUtil.resolveErrorOnRoute(ErrorCodeUtil.findErrorCode('ACC_DENIED'), res);
                }
            } else {
                ErrorCodeUtil.resolveErrorOnRoute(ErrorCodeUtil.findErrorCode('ACC_DENIED'), res);
            }
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(ErrorCodeUtil.findErrorCode('ACC_DENIED'), res);
        }
    };

    public static async verifyToken(token: string): Promise<number> {
        try {
            const payload: IJWTPayloadModel = await jwt.verify(token, config.jwtsecret);
            return payload.userId;
        } catch (e) {
            this.logger.debug(e, 'verifyToken');
            throw e;
        }
    }

    public static isRouteGuarded(route: string): boolean {
        return this.routePermissions.has(route);

    }

    public static async verifyRoutePermission(routeName: string, userId: number): Promise<boolean> {
        try {
            let power: number = 0;
            let roles: number[] = [];
            if (userId) {
                const rows: RowDataPacket[] = await this.db.query(
                    `SELECT auth_user_role.role_id as id, auth_role.power as power
                    FROM auth_user_role 
                    JOIN auth_user ON auth_user.id = auth_user_role.user_id
                    JOIN auth_role ON auth_role.id = auth_user_role.role_id
                    WHERE auth_user.id = ${userId};`);
                rows.forEach(row => {
                    if(row.power > power) {
                        power = row.power;
                    }
                });
                roles = rows.map(row => row.id);
                const route: RouteWithPermissionsModel = this.routePermissions.get(routeName);
                if(route.requiredPower <= power) {
                    return true;
                } else if(roles.some(role => route.permittedRoles.includes(role))) {
                    return true;
                }
                return false;
            }
        } catch (e) {
            if(ErrorCodeUtil.isErrorWithCode(e)) {
                throw e;
            }
            this.logger.error(e, 'verifyPermissions');
        }
    }

    public static async initRoutePermissions() {
        let rows: RowDataPacket[] = [];
        try {
            rows = await this.db.query('SELECT name, id FROM auth_role;');
        } catch (e) {
            this.logger.error(e, 'initRoutePermissions');
        }

        const roleIds: Map<string, number> = new Map();
        rows.forEach(row => {
            if (row.name && row.id) {
                roleIds.set(row.name, row.id);
            }
        });

        if (routePermissions) {
            const power: number = (routePermissions.requiredPower) ? routePermissions.requiredPower : 0;
            this.generateRoute(routePermissions, power, '', roleIds);
        } else {
            this.logger.warn('No route permission model provided; all routes are exposed.');
        }
    }

    public static generateRoute(route: IRoutePermission, parentPower: number, parentRoute: string, roleIds: Map<string, number>) {
        const power: number = (route.requiredPower > parentPower) ? route.requiredPower : parentPower;
        const absoluteRoute: string = parentRoute + '/' + route.route;
        this.routePermissions.set(
            absoluteRoute,
            new RouteWithPermissionsModel(power, (route.permittedRoles) ? route.permittedRoles
                .filter(name => roleIds.has(name))
                .map(name => roleIds.get(name)) : []
            )
        );
        if (!!route.children) {
            route.children.forEach(child => this.generateRoute(child, power, absoluteRoute, roleIds));
        }
    }
}
