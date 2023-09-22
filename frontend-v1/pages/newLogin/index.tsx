import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router'; 
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { prodUrl } from '../../models/transactionModels';

const NewLogin = () => {
  const router = useRouter(); // Initialize the router
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const [email, setEmail] = useState('');

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleBalanceChange = (event: any) => {
    setBalance(event.target.value);
  };

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleCreateWallet = async () => {
    // Check if all inputs are present
    if (name.trim() === '' || balance <= 0 || email.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }

    // Make an API call
    const apiUrl = `${prodUrl}/initialise/wallet`;
    const requestBody = {
      name: name,
      balance: balance,
      email: email,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Server Error: Failed to create wallet');
      }

      // Handle success, e.g., redirect to a dashboard page
      alert('Wallet created successfully.');
      localStorage.setItem('email_id', email);

      router.push('/dashboard'); 
      // Redirect or navigate to another page here if needed
    } catch (error: any) {
      alert('Error creating wallet: ' + error.message);
    }
  };

  return (
    <div>
      <Box sx={{ minWidth: 200 }}>
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={handleNameChange}
          style={{ marginTop: '20px' }}
        />
        <TextField
          id="balance"
          label="Balance"
          type="number"
          variant="outlined"
          fullWidth
          value={balance}
          onChange={handleBalanceChange}
          style={{ marginTop: '20px' }}
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          style={{ marginTop: '20px' }}
        />
        <Button
          style={{ marginTop: '20px', marginLeft: '35px', marginBottom: '30px' }}
          variant="contained"
          onClick={handleCreateWallet}
        >
          Create Wallet
        </Button>
      </Box>
    </div>
  );
};

export default NewLogin;
