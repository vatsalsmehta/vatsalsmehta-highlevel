import { transactionPrefix } from "../constants/constantv1";
import { walletPrefix } from "../constants/constantv1";

// Function to generate an ID starting with "TN" followed by 10 numbers
export function generateTransactionId() {
    const randomNumbers = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    return transactionPrefix + randomNumbers;
  }

  export function generateWalletId() {
    const randomNumbers = Math.floor(Math.random() * 10000000000).toString().padStart(8, '0');
    return walletPrefix + randomNumbers;
  }


  