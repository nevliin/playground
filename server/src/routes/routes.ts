import {NextFunction, Request, Response, Router} from "express";
import {Logger, LoggingUtil} from "../utils/logging/logging.util";
import {TestService} from "../services/test.service";
import {Dependencies} from "../core/dependencies";

export class Routes {

    logger: Logger = Dependencies.get<LoggingUtil>('logging').getLogger('Routes');

    constructor() { }

    public create(router: Router) {

        this.logger.info('Creating routes', 'create');

        //add home page route
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.json(TestService.getTest());
        });
    }
}