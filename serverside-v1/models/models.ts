
export interface walletInitialisationResponse {
    "walletId" : string,
    "name": string,
    "transactionId": string,
    "date": string
}

export interface WalletDetails {
    walletName: string;
    currentBalance: number;
    lastTransactionId: string;
    updatedAt: string; // This assumes "updatedAt" is stored as a string; you can change this to a Date if it's stored as a Date in your database
    SK: string; // association_type
    PK: string; // walletId
  }
  
  export interface TransactionEntry {
    currentBalance: number;
    description: string;
    transactionId: string;
    transactionType: string;
  }
  
  export interface WalletHistory {
    PK: string;
    SK: string;
    transactionHistory: TransactionEntry[];
    updatedAt: string;
  }
  
  