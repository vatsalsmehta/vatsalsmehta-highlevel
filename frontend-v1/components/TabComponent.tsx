import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import WalletComponent from './WalletComponent';
import HistoryComponent from './HistoryComponent';

const TabComponent = () => {
  const [currentopenTabValue, setcurrentopenTabValue] = useState(0);

  const handletabChange = (event: React.SyntheticEvent, newValue: number) => {
    //console.log(event.currentTarget.textContent); this has exact value/label through which also you can make a switch case to render some component by taking another currentcomponent state in string.
    setcurrentopenTabValue(newValue);
  };
  
  const alllabels=["Wallet Details","History"];
  
  const renderComponent = () => {
    switch(currentopenTabValue){
      case 0:
        return <WalletComponent/>;
      case 1:
        return <HistoryComponent/>
      default:
        return <></>
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>

        {/* In below line the value property requires an integer through which it points/highlights the current tab */}
        {/* The onChange method passes in two things : a react SyntheticEvent as well as a integer value that 
        corresponds to the index of new tab clicked or the  index of child tab clicked/changed*/}
        <Tabs value={currentopenTabValue} onChange={handletabChange} aria-label="basic tabs example">

          {/* here we generate the labels for each tab */}
          {alllabels.map((label,index)=>{
            return(
              <Tab label={label} key={index} style={{color: 'white'}} />
            )
          })};

        </Tabs>

      </Box>

      {/* render component on base of tab currently open */}
      {renderComponent()}
      
    </Box>
  );
}

export default TabComponent;
