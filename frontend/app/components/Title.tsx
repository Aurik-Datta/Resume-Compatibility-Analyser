import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Styled container with button-like appearance
const TitleContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  border: `1px solid #164296`,
  //rounded corners
  borderRadius: 20,
  paddingLeft: 25,
  paddingRight: 25,
  paddingTop: 5,
  paddingBottom: 5,
  display: 'inline-flex',
  alignItems: 'center', // Center the text vertically
  justifyContent: 'center', // Center the text horizontally
  // Add more styles as needed
}));

// Extending TypographyProps to allow passing any Typography props to Title
interface TitleProps extends TypographyProps {
  children?: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children, ...typographyProps }) => (
  <TitleContainer>
    <Typography variant="body2" fontFamily={'Fenix'} {...typographyProps} >
      {children}
    </Typography>
  </TitleContainer>
);

export default Title;
