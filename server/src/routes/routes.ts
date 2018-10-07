import {Application, NextFunction, Request, Response, Router} from "express";
import {TestService} from "../services/test.service";
import {AuthUtil} from "../utils/auth/auth.util";
import {authRouter} from "./auth-routes";
import {CRUDConstructor} from "../core/crud-constructor";
import {TestModel} from "../models/test.model";

const express = require('express');
export const router = express.Router();

export class Routes {

    public static init(app: Application) {

        const t: TestService = new TestService();
        const auth: AuthUtil = new AuthUtil();
        const testModelCRUD: CRUDConstructor<TestModel> = new CRUDConstructor<TestModel>(new TestModel(), 'fin_category');

        app.use('/index', async (req: Request, res: Response, next: NextFunction) => {
            res.json(await t.getTest());
        });

        app.use('/test', testModelCRUD.getRouter());
    }
}
