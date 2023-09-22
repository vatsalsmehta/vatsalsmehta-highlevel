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

  // TODO - add it into aws secrets manager instead of here
  // this is not a good practice but doing it because of time constraints
  export const prodUrl = 'http://65.1.3.218:4000'
  
  
  