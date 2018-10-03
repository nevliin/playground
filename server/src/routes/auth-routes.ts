import {NextFunction, Request, Response, Router} from "express";
import {Auth} from "../utils/auth/auth";
import {ISignUpModel} from "../utils/auth/signup.model";

const express = require('express');

export const init = (): Router => {
    const authRouter = express.Router();

    const auth: Auth = new Auth();
    authRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = await auth.signUp((<ISignUpModel>req.body));
            res.status(200).send({
                userId: userId
            })
        } catch (e) {
            if(e.message.startsWith('ER_DUP_ENTRY')) {
                res.status(500).send({
                    id: 1,
                    error: 'Username already exists'
                });
            } else {
                res.status(500).send({
                    id: 0,
                    error: e.message
                });
            }
        }
    });

    return authRouter;
};

export const authRouter = init();

