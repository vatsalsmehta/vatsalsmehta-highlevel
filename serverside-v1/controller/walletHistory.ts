import { association_type } from "../constants/constantv1"
import { docClient, tableName } from "../utils/awsConfigs"
import { getItemFromDb, putItemToDb } from "../utils/dbUtils"
import { BadRequestError } from "../utils/error"
import { WalletHistory } from "../models/models"

export const getHistoryDetailsForWalletId = async(walletId: string) => {
    const walletHistory = await getItemFromDb(walletId, association_type.HISTORY)
    return walletHistory as WalletHistory
}

export const addHistoryToWallet = async(walletId: string, description: string, previousTransactionHistory: any, currentBalance: number, transactionType: string, transactionId: string, transactionAmount: number ) => {
    
    const newHistoryObject = {
        "walletId" : walletId,
        "transactionId": transactionId,
        "transactionAmount": transactionAmount,
        "transactionType": transactionType,
        "currentBalance": currentBalance,
        "description": description,
        "createdAt": new Date().toISOString()
    }

    const updatedTransactionHistory = [ newHistoryObject, ...previousTransactionHistory ]
    

    const data = {
        "PK": walletId,
        "SK": association_type.HISTORY,
        "transactionHistory": updatedTransactionHistory,
        "lastUpdatedAt" : new Date().toISOString()
    }

    await putItemToDb(tableName, data, "addHistoryToWallet")

    return data
}
    