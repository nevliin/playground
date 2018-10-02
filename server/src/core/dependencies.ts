import {Dependable} from "./init-dependency-interface";
import "reflect-metadata";

export function injectable(id: string) {
    return (constructor: Function) => {
        Dependencies.dependencies.set(id, <{ new (): Dependable }>constructor);
        Dependencies.instances.set(id, undefined);
        console.log('injectable added');
    }
}

export class Dependencies {

    static instances: Map<string, object> = new Map<string, object>();
    static dependencies: Map<string, { new (): Dependable }> = new Map<string,{ new (): Dependable }>();

    static get<T>(id: string): T {
        console.log(this.instances);
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
            const instance: object = new (this.dependencies.get(id));
            if(!!instance) {
                throw new Error(`Construction of dependency with identifier ${id} failed.`)
            }
            if(this.initialized(instance)) {
                instance.initDependency();
            }
            this.instances.set(id, instance);
        }
        return <T><unknown>this.instances.get(id);
    }

    static initialized(object: any): object is Dependable {
        return 'initDependency' in object;
    }

}