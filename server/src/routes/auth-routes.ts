import {NextFunction, Request, Response, Router} from "express";
import {AuthUtil} from "../utils/auth/auth.util";
import {ISignUpModel} from "../utils/auth/signup.model";
import {ErrorCodeUtil} from "../utils/error-code/error-code.util";
import {ILoginModel} from "../utils/auth/login.model";
import {IUpdatePasswordModel} from "../utils/auth/update-password.model";

const express = require('express');

export const init = (): Router => {
    const authRouter = express.Router();
    authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
        try {

            const userId: number = await AuthUtil.signUp((<ISignUpModel>req.body));
            res.status(200).send({
                userId: userId
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: string = await AuthUtil.login(<ILoginModel>req.body);
            res.status(200).send({
                token: token
            })
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    authRouter.post('/updatePassword', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = await AuthUtil.updatePassword(<IUpdatePasswordModel>req.body);
            res.status(200).send({
                userId: userId
            });
        } catch (e) {
            ErrorCodeUtil.resolveErrorOnRoute(e, res);
        }
    });

    return authRouter;
};

export const authRouter = init();

