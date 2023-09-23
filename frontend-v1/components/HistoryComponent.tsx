import React, { useEffect, useState } from 'react';
import styles from './historyComponent.module.css';
import { TransactionHistory, prodUrl } from '../models/transactionModels';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, Select } from '@mui/material';

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

function convertToCSV(data: TransactionHistory[]): string {
  const csvHeader = [
    'transactionId',
    'description',
    'currentBalance',
    'transactionAmount',
    'createdAt',
    'walletId',
    'transactionType',
  ];

  const csvData = data.map((item) => {
    return [
      item.transactionId,
      item.description,
      item.currentBalance,
      item.transactionAmount,
      item.createdAt,
      item.walletId,
      item.transactionType,
    ].join(',');
  });

  return [csvHeader.join(','), ...csvData].join('\n');
}


const HistoryComponent = () => {
  const walletId = localStorage.getItem('walletId') || "";
  console.log("display service data is :", walletId);

  const [sortBy, setSortBy] = useState(''); // Initially, no sorting is applied
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([]); // State to store transaction history

  function handleDownloadCSV() {
    const csvData = convertToCSV(transactionHistory);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'transaction_history.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
  //   const selectedOption = event.target.value;
  //   setSortBy(selectedOption);
  
  //   if (selectedOption === 'amount') {
  //     // Sort by transactionAmount in ascending order
  //     setTransactionHistory([...transactionHistory].sort((a, b) => a.transactionAmount - b.transactionAmount));
  //   } else if (selectedOption === 'date') {
  //     // Sort by createdAt in ascending order
  //     setTransactionHistory([...transactionHistory].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
  //   }
  // }

  function handleSortChange(event: any) {
    const selectedOption = event.target.value;
    setSortBy(selectedOption);
  
    if (selectedOption === 'amount') {
      // Sort by transactionAmount in ascending order
      setTransactionHistory([...transactionHistory].sort((a, b) => a.transactionAmount - b.transactionAmount));
    } else if (selectedOption === 'date') {
      // Sort by createdAt in ascending order
      setTransactionHistory([...transactionHistory].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    } else {
      // No sorting or invalid sorting option
    }
  }
  
  

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
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            {/* Center the button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadCSV}
            >
              Download History
            </Button>

            <div style={{ marginBottom: '20px', marginTop:'20px' }}>
            <FormControl variant="outlined">
              <InputLabel htmlFor="sortSelect">Sort By:</InputLabel>
              <Select
                native
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By:"
                inputProps={{
                  name: 'sortSelect',
                  id: 'sortSelect',
                }}
              >
                <option aria-label="Select an option" value="" />
                <option value="amount">Amount</option>
                <option value="date">Date</option>
              </Select>
            </FormControl>
          </div>


          </div>
          
          <div className={styles.tableContainer}>
          <table className={styles.table}>
            <tbody>
            <tr
                    key="header" // Make sure to add a unique key prop when mapping
                    className={`${styles['table-row']} ${styles['odd-row']} ${styles['first-row']}`}
                  >
                    <td className={`${styles['table-cell']} ${styles['name-cell']}`}>index</td>
                    <td className={`${styles['table-cell']} ${styles['name-cell']}`}>Type</td>
                    <td className={`${styles['table-cell']} ${styles['name-cell']}`}>Amount</td>
                    <td className={`${styles['table-cell']} ${styles['name-cell']}`}>Description</td>
                    <td className={`${styles['table-cell']} ${styles['name-cell']}`}>Balance</td>
                  </tr>

              {
                transactionHistory.map((rowItem, index) => (
                  <tr
                    key={index} // Make sure to add a unique key prop when mapping
                    className={`${styles['table-row']} ${styles['odd-row']}`}
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
