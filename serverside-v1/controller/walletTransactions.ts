import { association_type, transaction_type } from "../constants/constantv1";
import { docClient, tableName } from "../utils/awsConfigs";
import { generateTransactionId } from "../utils/codeUtils";
import { putItemToDb } from "../utils/dbUtils";
import { BadRequestError } from "../utils/error";
import { getWalletDetails } from "./walletDetails";
import { addHistoryToWallet, getHistoryDetailsForWalletId } from "./walletHistory";

export const handleWalletTransaction = async(walletId: string, transactionType: string, transactionAmount: number, description: string ) => {
    const walletDetails = await getWalletDetails(walletId);
    if(!walletDetails) {
        throw new BadRequestError(`No wallet exists with WalletId ${walletId}`)
    }

    if(transactionAmount < 0) {
        throw new BadRequestError(`Amount Can't be negative`)
    }

    let currentWalletDetails;
    if(transactionType == transaction_type.DEBIT) {
        if(walletDetails.currentBalance < transactionAmount) {
            throw new BadRequestError(`Inufficient balance for transaction. Current balance is ${walletDetails.currentBalance}`)
        } else {
            currentWalletDetails = await debitAmountFromWallet(walletId, walletDetails.currentBalance, transactionAmount, walletDetails.walletName);
        }
    } else if (transactionType == transaction_type.CREDIT) {
        currentWalletDetails = await creditAmountToWallet(walletId, walletDetails.currentBalance, transactionAmount, walletDetails.walletName);
    }

    // once transaction is complete add it to history.
    const previousHistory = await getHistoryDetailsForWalletId(walletId);
    await addHistoryToWallet(walletId, description, previousHistory.transactionHistory, currentWalletDetails?.currentBalance || 0, transactionType, currentWalletDetails?.lastTransactionId || "null", transactionAmount)

    return currentWalletDetails;

}

export const creditAmountToWallet = async (walletId:string, currentAmount: number, creditAmount: number, walletName: string) => {
    const data = {
        "PK": walletId,
        "SK": association_type.TRANSACTION,
        "walletName": walletName,
        "lastTransactionId" : generateTransactionId(),
        "currentBalance": currentAmount + creditAmount,
        "updatedAt" : new Date().toISOString()
    }

    await putItemToDb(tableName, data, "creditAmountToWallet")

    return data
}

export const debitAmountFromWallet = async(walletId:string, currentBalance: number, debitAmount: number, walletName: string) => {
    const data = {
        "PK": walletId,
        "SK": association_type.TRANSACTION,
        "walletName": walletName,
        "lastTransactionId" : generateTransactionId(),
        "currentBalance": currentBalance - debitAmount,
        "updatedAt" : new Date().toISOString()
    }

    await putItemToDb(tableName, data, "debitAmountFromWallet")

    return data
}

