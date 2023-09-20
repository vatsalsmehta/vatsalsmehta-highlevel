import express, { Application, Request, Response } from "express";
import { BadRequestError, errorResponse } from "../utils/error";
import { handleWalletInitialisation } from "../controller/walletDetails";
const app: Application = express();


app.post("/wallet", async(req:Request, res:Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new BadRequestError('Request Body is missing');
        }

        if (!req.body.name || !req.body.balance || !req.body.email) {
            throw new BadRequestError('name , balance and email are required');
        }

        const walletInitialisationResponse = await handleWalletInitialisation(req.body.email, req.body.name, req.body.balance)

        res.status(walletInitialisationResponse.status).json(walletInitialisationResponse.body)

    } catch (error) {
        return errorResponse(error as Error, res);
    }

})

module.exports = app;