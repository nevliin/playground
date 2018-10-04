export class RouteWithPermissionsModel {

    requiredPower: number;
    permittedRoles: number[];

    constructor(requiredPower: number, permittedRoles: number[]) {
        this.requiredPower = requiredPower;
        this.permittedRoles = permittedRoles;
    }

}