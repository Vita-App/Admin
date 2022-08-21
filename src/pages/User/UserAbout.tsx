import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import Button from 'components/Button';
import {
  Card,
  Stack,
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';

import {
  Close,
  Check,
  MoreHoriz,
  Edit,
  Delete,
  ForwardToInbox,
  LinkedIn,
  Twitter,
} from '@mui/icons-material';
import { MentorSchemaType, UserType } from 'types';
import { SERVER_URL } from 'config.keys';
import { useSnackbar } from 'notistack';

interface Props {
  user: UserType;
  mentorInfo?: MentorSchemaType | null;
}

const approveMentor = async (id?: string) => {
  if (!id) return;

  const { data } = await axios.put(`${SERVER_URL}/api/approve-mentor`, {
    id,
  });

  return data;
};

const rejectMentor = async (id?: string) => {
  if (!id) return;

  const { data } = await axios.get(`${SERVER_URL}/api/reject-mentor`, {
    params: {
      id,
    },
  });

  return data;
};

const changeTopMentor = async (id?: string) => {
  const { data } = await axios.put(`${SERVER_URL}/api/change-topmentor`, {
    id,
  });

  return data;
};

const deleteUser = async (id?: string) => {
  const { data } = await axios.delete(`${SERVER_URL}/api/delete-user/${id}`);

  return data;
};

// eslint-disable-next-line complexity
const UserAbout: React.FC<Props> = ({ user, mentorInfo }) => {
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [approved, setApproved] = useState(mentorInfo?.approved);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const approveMutation = useMutation((id: string) => approveMentor(id), {
    onSuccess: () => {
      enqueueSnackbar('Email sent to the user!', { variant: 'success' });
      setApproved(true);
    },
    onError: () => {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    },
  });

  const rejectMutation = useMutation((id: string) => rejectMentor(id), {
    onSuccess: () => {
      enqueueSnackbar('Email sent to the user!', { variant: 'success' });
      navigate('/');
    },
    onError: () => {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    },
  });

  const changeTopMentorMutation = useMutation(
    (id: string) => changeTopMentor(id),
    {
      onError: () => {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries('mentorInfo');
        enqueueSnackbar('An email has been sent to the user!', {
          variant: 'success',
        });
        setOpen(false);
      },
    },
  );

  const deleteMutation = useMutation((id: string) => deleteUser(id), {
    onError: () => {
      enqueueSnackbar("We couldn't delete this user. Something Went Wrong!", {
        variant: 'error',
      });
    },
    onSuccess: () => {
      setAnchorEl(null);
      queryClient.invalidateQueries('users');
      enqueueSnackbar('User deleted Successfully!', { variant: 'success' });
      navigate('/');
    },
  });

  return (
    <Card
      elevation={1}
      sx={{ bgcolor: 'transparent', p: 3, position: 'relative' }}>
      <IconButton
        sx={{
          position: 'absolute',
          top: 5,
          right: 5,
          bgcolor: 'white',
          zIndex: 10,
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreHoriz />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Edit color="primary" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem>
          <Button
            withConfirmation
            variant="text"
            color="error"
            size="small"
            onClick={() => deleteMutation.mutate(user._id)}
            loading={deleteMutation.isLoading}
            title="Delete User"
            message="Are you sure you want to delete this user? This user will be permanently deleted from the database!">
            <Delete color="error" sx={{ mr: 1 }} /> Delete
          </Button>
        </MenuItem>
      </Menu>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        <Box
          flex="1 0 400px"
          maxWidth="400px"
          minHeight="300px"
          maxHeight="400px"
          borderRadius={5}>
          <img
            src={
              user.avatar?.url ||
              'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
            }
            alt="user"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundPosition: 'center',
              borderRadius: 10,
            }}
          />
        </Box>
        <Stack>
          <Typography variant="h4">
            {user.first_name
              ? `${user.first_name} ${user.last_name}`
              : 'Unregistered'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {user.email}
          </Typography>
          {user.is_mentor && user.signup_completed && (
            <Typography variant="body1" color="textSecondary">
              {mentorInfo?.experiences[0]?.role} at{' '}
              {mentorInfo?.experiences[0]?.company}
            </Typography>
          )}
          <Stack direction="row">
            {mentorInfo?.linkedIn && (
              <IconButton
                target="_blank"
                href={mentorInfo?.linkedIn}
                aria-label="linkedIn"
                size="large"
                color="primary">
                <LinkedIn fontSize="inherit" />
              </IconButton>
            )}
            {mentorInfo?.twitter && (
              <IconButton
                target="_blank"
                href={mentorInfo?.twitter}
                aria-label="linkedIn"
                size="large"
                color="primary">
                <Twitter fontSize="inherit" />
              </IconButton>
            )}
          </Stack>
          <Stack direction="row" my={1} spacing={1}>
            <Tooltip title={user.verified ? 'Verified' : 'Not Verified'}>
              <Chip
                icon={user.verified ? <Check /> : <Close />}
                label={user.is_mentor ? 'Mentor' : 'Mentee'}
                color={user.verified ? 'success' : 'error'}
                variant="outlined"
              />
            </Tooltip>
            {mentorInfo && approved && (
              <Tooltip title="Approved">
                <Chip
                  icon={<Check />}
                  label="Approved"
                  color="success"
                  variant="outlined"
                />
              </Tooltip>
            )}
            {mentorInfo && !approved && (
              <Button
                withConfirmation
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => approveMutation.mutate(mentorInfo._id)}
                loading={approveMutation.isLoading}
                title="Approve Mentor"
                message="Are you sure you want to approve this user? This user will be able to take on sessions with other mentees!">
                Approve✔
              </Button>
            )}
            {mentorInfo && !approved && (
              <Button
                withConfirmation
                variant="contained"
                color="error"
                size="small"
                onClick={() => rejectMutation.mutate(user._id)}
                loading={rejectMutation.isLoading}
                title="Reject User"
                message="Are you sure you want to reject this user? This user will be permanently deleted from the database!">
                Reject❌
              </Button>
            )}
            {mentorInfo && approved && (
              <Button
                withConfirmation
                variant="contained"
                color="warning"
                onClick={() => changeTopMentorMutation.mutate(mentorInfo._id)}
                size="small"
                openDialog={open}
                setOpenDialog={setOpen}
                loading={changeTopMentorMutation.isLoading}
                title={
                  mentorInfo.top_mentor ? 'Demote to mentor' : 'Make top mentor'
                }
                message={
                  mentorInfo.top_mentor
                    ? 'Are you sure you want to demote this use back to a normal Mentor ?'
                    : 'Are you sure you want to make this user a top mentor?'
                }>
                {mentorInfo.top_mentor
                  ? 'Demote back to mentor ⬇'
                  : 'Make Top Mentor ⚡'}
              </Button>
            )}
          </Stack>
          <Stack direction="row" spacing={1} my={2}>
            <Button variant="outlined" startIcon={<ForwardToInbox />}>
              Send Mail
            </Button>
            <Button variant="contained" color="error" size="small">
              Ban
            </Button>
            <Button variant="contained" color="warning" size="small">
              Restrict
            </Button>
          </Stack>
          <Typography variant="body2">
            {user.bio || 'No bio available'}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default UserAbout;
