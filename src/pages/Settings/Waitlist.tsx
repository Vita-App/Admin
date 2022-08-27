import React from 'react';
import axios from 'axios';
import { useQuery, useMutation } from 'react-query';
import { Box, Button, Typography } from '@mui/material';
import { SERVER_URL } from 'config.keys';
import { WaitlistType } from 'types';
import { useSnackbar } from 'notistack';

const getWaitList = async () => {
  const { data } = await axios.get(`${SERVER_URL}/api//get-waitlist`);

  return data.waitlist as WaitlistType[];
};

const sendInvites = async () => {
  const { data } = await axios.get(`${SERVER_URL}/api/send-invites`);

  return data;
};

const Waitlist = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading, isError, data, refetch } = useQuery(
    'waitlist',
    getWaitList,
  );
  const mutation = useMutation('send-invites', sendInvites, {
    onSuccess: () => refetch(),
    onError: () => {
      enqueueSnackbar('Error sending invites', { variant: 'error' });
    },
  });

  if (isLoading) return null;
  if (isError) return null;

  return (
    <Box>
      <Typography variant="h4">Waitlist</Typography>
      <Typography variant="body1">
        {data?.length} people are in waitlist
      </Typography>
      <Typography variant="body1">
        {data?.filter((entry) => entry.invited).length} people have been
        invited!
      </Typography>
      <Button
        disabled={mutation.isLoading}
        sx={{ mt: 2 }}
        variant="contained"
        color="secondary"
        onClick={() => mutation.mutate()}>
        {mutation.isLoading ? 'Sending invites...' : 'Send invites'}
      </Button>
    </Box>
  );
};

export default Waitlist;
