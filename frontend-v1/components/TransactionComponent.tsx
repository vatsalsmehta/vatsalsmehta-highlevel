import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

interface TransactionComponentProps {
  handleInitiateTransaction: (txnType: string, description: string, amount: number) => void;
}

export default function TransactionComponent(props: TransactionComponentProps) {
  const handlePlaceTransaction = props.handleInitiateTransaction;
  const allAvailableTxnType = ['CREDIT', 'DEBIT'];
  const [selectedTxnType, setSelectedTxnType] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0); // Initialize with a default value

  const handleTxnChange = (event: SelectChangeEvent) => {
    setSelectedTxnType(event.target.value as string);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(event.target.value) || 0; // Convert to a number, default to 0 if invalid input
    setAmount(newAmount);
  };

  const handleInitiateTransaction = () => {
    if (description.trim() === '') {
      // Check if description is empty (or contains only spaces)
      alert('Description cannot be empty');
    } else {
      handlePlaceTransaction(selectedTxnType, description, amount);
    }
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Transaction</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedTxnType}
          label="UPI Wallet"
          onChange={handleTxnChange}
        >
          {allAvailableTxnType.map((txnType: string, index: number) => (
            <MenuItem key={index} value={txnType}>
              {txnType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        id="description"
        label="Description"
        variant="outlined"
        fullWidth
        value={description}
        onChange={handleDescriptionChange}
        style={{ marginTop: '20px' }}
      />
      <TextField
        id="amount"
        label="Amount"
        type="number"
        variant="outlined"
        fullWidth
        value={amount}
        onChange={handleAmountChange}
        style={{ marginTop: '20px' }}
      />
      <div style={{ textAlign: 'center'}}>
        <Button
          style={{ marginTop: '20px', marginBottom: '30px' }}
          variant="contained"
          onClick={handleInitiateTransaction}
        >
          Initiate Transaction
        </Button>
      </div>
      
    </Box>
  );
}
