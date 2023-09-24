import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { prodUrl } from '../../models/transactionModels';

const NewLogin = () => {
  const router = useRouter();
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
    if (name.trim() === '' || balance <= 0 || email.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }

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

      alert('Wallet created successfully.');
      localStorage.setItem('email_id', email);

      router.push('/dashboard');
    } catch (error: any) {
      alert('Error creating wallet: ' + error.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ minWidth: 200, textAlign: 'center', padding: '20px' }}>
        <Typography variant="h5" style={{ marginBottom: '20px', color: 'white' }}>
          Create a New Wallet
        </Typography>
        <Typography variant="body1" style={{ marginBottom: '20px', color: 'white' }}>
          Enter your Name, initial Balance Amount, and Email
        </Typography>
        <TextField
          id="name"
          placeholder="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={handleNameChange}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          id="balance"
          placeholder="Balance"
          type="number"
          variant="outlined"
          fullWidth
          value={balance}
          onChange={handleBalanceChange}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          id="email"
          variant="outlined"
          fullWidth
          placeholder='Email'
          value={email}
          onChange={handleEmailChange}
          style={{ marginBottom: '20px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateWallet}
          style={{ marginTop: '20px', minWidth: '150px' }}
        >
          Create Wallet
        </Button>
      </Box>
    </div>
  );
};

export default NewLogin;
