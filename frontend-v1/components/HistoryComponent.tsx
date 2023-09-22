import React, { useEffect, useState } from 'react';
import styles from './historyComponent.module.css';
import { TransactionHistory, prodUrl } from '../models/transactionModels';

async function getTransactionHistoryByWalletId(walletId: string) {
  const url = `${prodUrl}/wallet/transactions?walletId=${walletId}&limit=25`;

  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'GET', // Use GET method to fetch data
      headers: headers
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const responseData = await response.json();
    return responseData; // Return the fetched data
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error
  }
}



const HistoryComponent = () => {
  const walletId = localStorage.getItem('walletId') || "";
  console.log("display service data is :", walletId);

  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([]); // State to store transaction history

  useEffect(() => {
    // Call the API and update the state when the component mounts
    getTransactionHistoryByWalletId(walletId)
      .then(data => setTransactionHistory(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [walletId]); // Trigger the effect whenever walletId changes

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <div id={styles.header}>
          <h1 style={{marginLeft: '10px'}}>Transaction History </h1>
        </div>
        <div id={styles.leaderboard} className={styles.leaderboard}>
          <div className={styles.tableContainer}>
          <table className={styles.table}>
            <tbody>
              {
                transactionHistory.map((rowItem, index) => (
                  <tr
                    key={index} // Make sure to add a unique key prop when mapping
                    className={`${styles['table-row']} ${styles['odd-row']} ${index === 0 ? styles['first-row'] : ''}`}
                  >
                    <td className={`${styles['table-cell']} ${styles['name-cell']}`}>{index+1}</td>
                    <td className={`${styles['table-cell']} ${styles['name-cell']}`}>{rowItem.transactionType}</td>
                    <td className={`${styles['table-cell']} ${styles['name-cell']}`}>{rowItem.transactionAmount}</td>
                    <td className={`${styles['table-cell']} ${styles['name-cell']}`}>{rowItem.description}</td>
                    <td className={`${styles['table-cell']} ${styles['name-cell']}`}>{rowItem.currentBalance}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryComponent;
