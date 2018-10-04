export interface IRoutePermission {
    route: string;
    requiredPower?: number;
    permittedRoles?: string[];
    children?: IRoutePermission[];
}