import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography,
  LinearProgress,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import Container from 'components/Container';
import { SERVER_URL } from 'config.keys';

interface FormData {
  email: string;
  password: string;
}

const authenticateUser = async (formData: FormData) => {
  const { data } = await axios.post(`${SERVER_URL}/api/admin/login`, formData);

  return data;
};

const Auth = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [visibile, setVisibile] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<FormData>();
  const { isLoading, refetch, data, isError } = useQuery(
    ['login'],
    async () => await authenticateUser(getValues()),
    {
      enabled: false,
    },
  );

  const onSubmit = () => {
    refetch();
  };

  useEffect(() => {
    if (data) {
      enqueueSnackbar(
        'We have sent an otp to your email. Kindly enter your otp here',
        {
          variant: 'success',
        },
      );

      navigate('/otp', { state: getValues().email });
    }
  }, [data, navigate, enqueueSnackbar, getValues]);

  return (
    <Container centered>
      <Typography variant="h4" mb={3}>
        Log in
      </Typography>
      <Card
        elevation={6}
        sx={{ minWidth: '400px', py: 10, px: 5, position: 'relative' }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate>
        {isLoading && (
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              width: '100%',
              left: 0,
            }}
            variant="indeterminate"
          />
        )}
        <Stack spacing={2}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message || ''}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={visibile ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setVisibile(!visibile)}>
                      {visibile ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            )}
          />
          {isError && (
            <Typography variant="body2" color="error">
              Invalid Credentials
            </Typography>
          )}
          <Button
            variant="contained"
            color="error"
            type="submit"
            disabled={isLoading}>
            Sign in
          </Button>
        </Stack>
      </Card>
    </Container>
  );
};

export default Auth;
