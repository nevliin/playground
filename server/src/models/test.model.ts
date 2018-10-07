import {ICRUDModel} from "../core/crud.model";

export class TestModel implements ICRUDModel {
    id: number = 0;
    name: string = '';
    active: boolean = false;

}