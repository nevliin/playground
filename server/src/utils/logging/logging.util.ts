
export class LoggingUtil {

    static init() {

    }

    static getLogger(module: string): Logger {
        return new Logger(module);
    }

}

export class Logger {

    module: string;

    constructor(module: string) {
        this.module = module;
    }

    error(message: Error | string, method?: string) {
        console.error(this.createMessage(message, method));
        if(message instanceof Error) {
            console.error(message.stack);
        }
    }

    warn(message: Error | string, method?: string) {
        console.warn(this.createMessage(message, method));
        if(message instanceof Error) {
            console.warn(message.stack);
        }
    }

    info(message: Error | string, method?: string) {
        console.info(this.createMessage(message, method));
    }

    trace(message: Error | string, method?: string) {
        console.trace(this.createMessage(message, method));
    }

    debug(message: Error | string, method?: string) {
        console.debug(this.createMessage(message, method));
    }

    private createMessage(message: Error | string, method?: string): string {
        return `[${(new Date()).toISOString()}] [${this.module}${(!!method) ? ':' + method : ''}] ${(message instanceof Error) ? message.name + ': ' + message.message : message}`;
    }



}