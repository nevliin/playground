import {NextFunction, Request, Response, Router} from "express";
import {LoggingUtil} from "../utils/logging/logging.util";
import {TestService} from "../services/test.service";

export class Routes {

    logger: LoggingUtil = new LoggingUtil('Routes');

    constructor() { }

    public create(router: Router) {

        this.logger.info('Creating routes', 'create');

        //add home page route
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.json(TestService.getTest());
        });
    }
}