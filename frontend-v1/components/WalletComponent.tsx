import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import TransactionComponent from './TransactionComponent';
import { WalletDetails } from '../models/transactionModels';

const WalletComponent = () => {
    const [walletDetails, setWalletDetails] = useState<WalletDetails>();
    const [isFetching, setIsFetching] = useState<Boolean>(false);

    useEffect(() => {
      handleFetchWalletDetailsbyemail();
    },[])

    const handleFetchWalletDetailsbyemail = async() => {
      try {
        setIsFetching(true)
        const email = localStorage.getItem('email_id');
        const response = await fetch(`http://localhost:4000/wallet/email/${email}`);
        if (!response.ok) {
          throw new Error('Server Error: Failed to Fetch WalletDetails');
        }
        const jsonData: WalletDetails = await response.json() as WalletDetails;
        localStorage.setItem("walletId", jsonData.PK);
        console.log("Data from API is ", jsonData);
        setIsFetching(false);
        setWalletDetails(jsonData);
      } catch (error) {
        setIsFetching(false)
        alert("Failed to Fetch Response");
        console.error('Error fetching Service data:', error);
      }
    }

    async function handlePlaceTransaction(transaction_type: string, amount: number, description: string) {
      const url = `http://localhost:4000/transact/${walletDetails?.PK}`;
    
      const headers = {
        'Content-Type': 'application/json',
      };
    
      const requestBody = JSON.stringify({
        amount: amount,
        description: description,
        transaction_type: transaction_type,
      });
    
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: requestBody, // Pass the JSON data as the request body
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    

    const handleInitiateTransaction = async(txnType: string, description: string, amount: number) => {
      await handlePlaceTransaction(txnType, amount, description);
      // this will lead to updation of bets placed once a person bets submits
      await handleFetchWalletDetailsbyemail()
  }

    return(
      <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px', fontWeight: 'bold' , justifyContent: 'center'}}>
        <div style={{color: 'white'}}>Fetch Details for Your Wallet</div>
        <Button variant='contained' onClick={handleFetchWalletDetailsbyemail} style={{ marginTop: '10px', fontWeight: 'bold' }}>Refresh</Button>
      </div>
      {walletDetails && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', backgroundColor: 'white', padding: '10px' }}>
          <h2>Wallet Details</h2>
          <p>Wallet Name: {walletDetails.walletName}</p>
          <p>Current Balance: {walletDetails.currentBalance}</p>
          <p>Last Transaction ID: {walletDetails.lastTransactionId}</p>
          <p>Updated At: {walletDetails.updatedAt}</p>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '180px', backgroundColor:'white', paddingTop:'30px' }}>
        <TransactionComponent handleInitiateTransaction={handleInitiateTransaction}/>

      </div>
    </div>
    )
};

export default WalletComponent;