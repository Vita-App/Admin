import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation } from 'react-query';
import {
  Button,
  IconButton,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import { SERVER_URL } from 'config.keys';
import { WaitlistType } from 'types';
import { useSnackbar } from 'notistack';
import { CopyAll, Window } from '@mui/icons-material';

const getWaitList = async () => {
  const { data } = await axios.get<{
    people: WaitlistType[];
    genrated: WaitlistType[];
  }>(`${SERVER_URL}/api//get-waitlist`);

  return data;
};

const sendInvites = async () => {
  const { data } = await axios.get(`${SERVER_URL}/api/send-invites`);

  return data;
};

const createInvites = async () => {
  const { data } = await axios.get(`${SERVER_URL}/api/create-invitations`);

  return data;
};

const GeneratedInvites: React.FC<{ genrated: WaitlistType[] }> = ({
  genrated,
}) => {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    const text = genrated.map((i) => i.inviteCode).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timer;
    if (copied) {
      timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  return (
    <>
      <Tooltip open={copied} title="Copied!">
        <Button
          variant="contained"
          color="success"
          endIcon={<CopyAll />}
          onClick={copyAll}>
          Copy all
        </Button>
      </Tooltip>
      <List sx={{ minWidth: '400px' }}>
        {genrated.map((invite) => (
          <ListItem key={invite._id}>
            <ListItemText primary={invite.inviteCode} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

const Waitlist = () => {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading, isError, data, refetch } = useQuery(
    'waitlist',
    getWaitList,
  );

  const sendInvitesMutation = useMutation('send-invites', sendInvites, {
    onSuccess: () => {
      refetch();
      enqueueSnackbar('Invites sent successfully', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error sending invites', { variant: 'error' });
    },
  });

  const createInvitesMutation = useMutation('create-invites', createInvites, {
    onSuccess: (data) => {
      refetch();
      console.log(data);
      enqueueSnackbar('50 Invites created successfully', {
        variant: 'success',
      });
    },
    onError: () => {
      enqueueSnackbar('Error creating invites', { variant: 'error' });
    },
  });

  if (isLoading) return null;
  if (isError) return null;

  if (!data) return null;

  return (
    <Stack>
      <Typography variant="h4">Waitlist</Typography>
      <Typography variant="body1">
        {data.people.length} people are in waitlist
      </Typography>
      <Typography variant="body1">
        {data.people.filter((entry) => entry.invited).length} people have been
        invited!
      </Typography>
      <Button
        disabled={sendInvitesMutation.isLoading}
        sx={{ mt: 2 }}
        variant="contained"
        color="secondary"
        onClick={() => sendInvitesMutation.mutate()}>
        {sendInvitesMutation.isLoading
          ? 'Sending invites...'
          : 'Send invites to 10 people'}
      </Button>
      <Stack direction="row" spacing={2} alignItems="center" mt={2}>
        <Button
          disabled={createInvitesMutation.isLoading}
          variant="contained"
          color="success"
          onClick={() => createInvitesMutation.mutate()}>
          {createInvitesMutation.isLoading
            ? 'Creating invites...'
            : data.genrated.length !== 0
            ? 'Refresh 50 invite codes'
            : 'Create 50 invites'}
        </Button>
        {data.genrated.length !== 0 && (
          <IconButton onClick={() => setOpen(true)}>
            <Window />
          </IconButton>
        )}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Generated Invites</DialogTitle>
          <DialogContent>
            <GeneratedInvites genrated={data.genrated} />
          </DialogContent>
        </Dialog>
      </Stack>
    </Stack>
  );
};

export default Waitlist;
