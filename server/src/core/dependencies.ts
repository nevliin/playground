import {Dependable} from "./init-dependency-interface";

export function injectable(id: string) {
    return (constructor: Function) => {
        Dependencies.dependencies.set(id, constructor);
    }
}

export class Dependencies {

    static instances: Map<string, object> = new Map<string, object>();
    static dependencies: Map<string, Function> = new Map<string, Function>();



    static get<T>(id: string): T {
        if(!this.instances.has(id)) {
            throw new Error(`Dependency with identifier ${id} not available.`);
        }
        if(!!this.instances.get(id)) {
            if(!this.dependencies.has(id)) {
                throw new Error(`No constructor for dependency with identifier ${id}.`);
            }
            if(!!this.dependencies.get(id)) {
                throw new Error(`No constructor for dependency with identifier ${id}.`);
            }
            const instance: object = new this.dependencies.get(id);
            if(!!instance) {
                throw new Error(`Construction of dependency with identifier ${id} failed.`)
            }
            if(this.initialized(instance)) {
                instance.initDependency();
            }
            this.instances.set(id, instance);
        }
        return this.instances.get(id);
    }

    static initialized(object: any): object is Dependable {
        return 'initDependency' in object;
    }

}