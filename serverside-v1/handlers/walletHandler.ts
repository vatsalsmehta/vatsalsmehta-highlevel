import express, { Application, Request, Response } from "express";
import { BadRequestError, errorResponse } from "../utils/error";
import { getWalletDetails } from "../controller/walletDetails";
import { getHistoryDetailsForWalletId } from "../controller/walletHistory";
const app: Application = express();

app.get("/transactions", async (req: Request, res: Response) => {
    try {
      const walletId = req.query.walletId as string;
      //const skip = parseInt(req.query.skip as string, 10) || 0;
      const limit = parseInt(req.query.limit as string, 10) || 10;
  
      if (!walletId) {
        throw new BadRequestError('walletId is missing');
      }
  
      const walletHistoryDetails = (await getHistoryDetailsForWalletId(walletId)).transactionHistory.slice(0, limit);
  
      // Return the response
      res.status(200).json(walletHistoryDetails);
    } catch (error) {
      return errorResponse(error as Error, res);
    }
  });
  


app.get("/:walletId", async(req:Request, res:Response) => {
    try {
        const walletId = req.params.walletId
        if (!walletId) {
            throw new BadRequestError('walletId is missing');
        }

        const walletDetails = await getWalletDetails(walletId)

        res.status(200).json(walletDetails)

    } catch (error) {
        return errorResponse(error as Error, res);
    }

})



module.exports = app;