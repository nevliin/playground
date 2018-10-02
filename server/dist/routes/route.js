"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRoute {
    constructor() {
        this.title = "Tour of Heros";
        this.scripts = [];
    }
    addScript(src) {
        this.scripts.push(src);
        return this;
    }
}
exports.BaseRoute = BaseRoute;
