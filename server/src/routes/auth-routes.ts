import {NextFunction, Request, Response, Router} from "express";
import {AuthUtil} from "../utils/auth/auth.util";
import {ISignUpModel} from "../utils/auth/signup.model";
import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {ILoginModel} from "../utils/auth/login.model";

const express = require('express');

export const init = (): Router => {
    const authRouter = express.Router();

    const auth: AuthUtil = new AuthUtil();
    authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = await auth.signUp((<ISignUpModel>req.body));
            res.status(200).send({
                userId: userId
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: string = await auth.login(<ILoginModel>req.body);
            res.status(200).send({
                token: token
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });


    return authRouter;
};

export const authRouter = init();

