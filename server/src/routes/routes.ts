import {Application, NextFunction, Request, Response, Router} from "express";
import {LoggingUtil} from "../utils/logging/logging.util";
import {TestService} from "../services/test.service";
import {AuthUtil} from "../utils/auth/auth.util";
import {authRouter} from "./auth-routes";

const express = require('express');
export const router = express.Router();

export class Routes {

    public static init(app: Application) {

        const t: TestService = new TestService();
        const auth: AuthUtil = new AuthUtil();

        app.use('/index', async (req: Request, res: Response, next: NextFunction) => {
            res.json(await t.getTest());
        });

        app.use('/auth', authRouter);
    }
}
