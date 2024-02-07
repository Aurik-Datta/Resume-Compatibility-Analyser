import { Box, Stack, Typography, AppBar, Toolbar } from '@mui/material';
import HOneIcon from '../icons/HOneIcon.svg';
import Image from 'next/image';

const HOneFooter = () => {
    return(
        <AppBar position="static" color="secondary"
            sx={{
                top: 'auto',
                bottom: 0,
                marginTop: 'auto',
                width: '100%',
                height: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
        <Toolbar>
        <Stack 
            //centered
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ width: '100%', textAlign: 'center' }}
        >
            <Image src={HOneIcon} alt="HOne Logo" width={100} height={100} />
            <Typography variant="body1" sx={{color: 'text.primary'}}>Powered by H-One Pvt (Ltd)</Typography>
            <Typography variant="body2" sx={{color: 'text.primary'}}>Copyright © 2024 All Rights Reserved By H-One.</Typography>
        </Stack>
        </Toolbar>
  </AppBar>
    );

}

export default HOneFooter;