import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = ({ fullScreen = true }) => {
  const spinner = (
    <CircularProgress />
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        {spinner}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      {spinner}
    </Box>
  );
};

export default LoadingSpinner;

