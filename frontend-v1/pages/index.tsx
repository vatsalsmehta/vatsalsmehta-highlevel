import * as React from 'react';
import { withRouter } from 'next/router'; // Import withRouter
import { Box, Button, TextField } from '@mui/material';
import { WalletDetails, prodUrl } from '../models/transactionModels';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh', // Adjust this if needed
};

class IndexPage extends React.Component {
  constructor(props:any) {
    super(props);
    this.state = {
      isFetching: false,
    };
  }

  handleLogin = async () => {
    const email = document.getElementById('outlined-basic-email') as HTMLInputElement;
    if (!email) {
      return;
    }

    try {
      this.setState({ isFetching: true });
      const response = await fetch(`${prodUrl}/wallet/email/${email.value}`);
      if (response.status !== 200) {
        throw new Error('Server Error: Failed to Fetch WalletDetails');
      }
      const jsonData = await response.json() as WalletDetails;
      console.log('Data from API is ', jsonData);
      this.setState({ isFetching: false });

      // Check if jsonData is not null and status is 200
      if (jsonData && response.status === 200) {
        localStorage.setItem('email_id', email.value); // Store email in local storage
        localStorage.setItem('walletId', jsonData.PK);
        this.props.router.push('/dashboard'); // Redirect to the dashboard page using props.router
      }
    } catch (error) {
      this.setState({ isFetching: false });
      alert(error);
      this.props.router.push('/newLogin'); 
      console.error('Error fetching Service data:', error);
    }
  };

  render() {
    return (
      <div style={containerStyle}>
        <h1 style={{ color: 'white' }}>Welcome to Frontend For Your UPI wallet </h1>

        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '26ch' },
            color: 'white',
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic-email"
            placeholder="Enter Email To Get to Your Wallet"
            style={{ padding: '5px' }}
            InputProps={{ disableUnderline: true }}
            variant="standard"
          />
        </Box>

        <Button variant="contained" onClick={this.handleLogin}>
          Login and Go To Dashboard
        </Button>
      </div>
    );
  }
}

export default withRouter(IndexPage); // Use withRouter to access the router prop
