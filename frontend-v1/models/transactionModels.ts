export interface WalletDetails {
    walletName: string;
    currentBalance: number;
    lastTransactionId: string;
    updatedAt: string;
    SK: string;
    PK: string;
  }

export interface TransactionHistory {
    transactionType: string;
    walletId: string;
    createdAt: string;
    transactionAmount: number;
    currentBalance: number;
    description: string;
    transactionId: string;
  }
  
  
  