import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { SERVER_URL } from 'config.keys';
import { useSearchParams } from 'react-router-dom';

const RefreshToken = () => {
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');

  return (
    <Stack>
      <Typography variant="h4" gutterBottom>
        Refresh Token
      </Typography>
      <Button
        variant="contained"
        onClick={() =>
          (window.location.href = `${SERVER_URL}/api/get-refresh-token`)
        }>
        Generate Refresh Token
      </Button>
      {success && (
        <Typography variant="body2" color="success.main">
          Refresh Token Generated!
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error.main">
          Error: {error}
        </Typography>
      )}
    </Stack>
  );
};

export default RefreshToken;
