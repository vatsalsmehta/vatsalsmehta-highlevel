import express, { Application, Request, Response } from "express";
import { BadRequestError, errorResponse } from "../utils/error";
import { handleWalletTransaction } from "../controller/walletTransactions";
const app: Application = express();


app.post("/:walletId", async(req:Request, res:Response) => {
    try {
        const walletId = req.params.walletId
        if (!walletId) {
            throw new BadRequestError('walletId is missing');
        }

        if (!req.body.amount || !req.body.description || !req.body.transaction_type) {
            throw new BadRequestError('amount and description are required');
        }

        const transactionResponse = await handleWalletTransaction(walletId, req.body.transaction_type, req.body.amount, req.body.description)

        res.status(200).json(transactionResponse)

    } catch (error) {
        return errorResponse(error as Error, res);
    }

})

module.exports = app;