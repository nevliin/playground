import {NextFunction, Request, Response, Router} from "express";
import {LoggingUtil} from "../utils/logging/logging.util";
import {TestService} from "../services/test.service";

export class Routes {

    constructor() { }

    public create(router: Router) {

        const t: TestService = new TestService();

        //add home page route
        router.get("/index", (req: Request, res: Response, next: NextFunction) => {
            res.json(t.getTest());
        });
    }
}