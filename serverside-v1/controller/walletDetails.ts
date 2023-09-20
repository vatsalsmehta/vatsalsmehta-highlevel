import { association_type, transaction_type } from "../constants/constantv1"
import { WalletDetails, walletInitialisationResponse } from "../models/models"
import { tableName, docClient } from "../utils/awsConfigs"
import { generateWalletId } from "../utils/codeUtils"
import { getItemFromDb, putItemToDb } from "../utils/dbUtils"
import { BadRequestError } from "../utils/error"
import { addHistoryToWallet } from "./walletHistory"
import { creditAmountToWallet } from "./walletTransactions"

export const createUserWalletMapping = async(email: string, walletName: string) => {
    const userWalletDetails = await getWalletIdFromEmail(email)

    // createUserWalletMapping should be Idempotent
    // IF one Wallet Exists for an email and another Request is hit we should not allow db transaction
    // One should not create multiple WalletIds for one email
    if (userWalletDetails) {
        throw new BadRequestError(`Wallet Already Exists for Email ${email} with WalletId : ${userWalletDetails.walletId}`)
    }

    // mapping between email and WalletId
    const data = {
        "PK": email,
        "SK": association_type.WALLET,
        "walletId": generateWalletId(),
        "walletName": walletName,
        "createdAt": new Date().toISOString()
    }

    await putItemToDb(tableName, data, "createUserWalletMapping")

    return data
    
}

export const getWalletDetails = async(walletId:string) => {
    const walletDetails = await getItemFromDb(walletId, association_type.TRANSACTION)
    return walletDetails as WalletDetails
}

export const getWalletIdFromEmail = async (email:string) => {
   const userWalletMapping = await getItemFromDb(email, association_type.WALLET)
   return userWalletMapping
    
}

export const handleWalletInitialisation = async(email:string, walletName:string, balance:number) => {
    
    // step 1 - create 1:1 mapping between user email and wallet
    const walletCreationDetails = await createUserWalletMapping(email, walletName)

    // step 2 - reuse the transaction function made for crediting money into wallet
    const currentWalletDetails = await creditAmountToWallet(walletCreationDetails.walletId, 0, balance, walletCreationDetails.walletName )
    addHistoryToWallet(walletCreationDetails.walletId,"Wallet Creation Credit",[], balance, transaction_type.CREDIT, currentWalletDetails.lastTransactionId, balance)

    // Create a walletInitialisationResponse object
    const walletResponse: walletInitialisationResponse = {
        walletId: walletCreationDetails.walletId,
        name: walletCreationDetails.walletName,
        transactionId: currentWalletDetails.lastTransactionId,
        date:  currentWalletDetails.updatedAt
    };


    return {
        "status": 200,
        "body": walletResponse
    }


}