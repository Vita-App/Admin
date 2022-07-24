import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from 'config.keys';
import { Stack, IconButton, Dialog } from '@mui/material';
import ConfirmDialog from 'components/Modals/ConfirmDialog';
import { Group, Add, VideoCall, Logout, Settings } from '@mui/icons-material';
import ToolbarLink from './ToolbarLink';
import { useSetRecoilState } from 'recoil';
import { authState } from 'store';
import { useNavigate } from 'react-router';

const Toolbar = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authState);

  const logout = async () => {
    setLoading(true);
    await axios.get(`${SERVER_URL}/api/admin/logout`);
    setLoading(false);
    setAuthState({ isLoggedIn: false, user: null });
    setOpen(false);
    navigate('/');
  };

  return (
    <Stack spacing={1}>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <ConfirmDialog
          onClose={() => setOpen(false)}
          onConfirm={logout}
          title="Logout"
          message="Do you want to logout ?"
          loading={loading}
        />
      </Dialog>
      <ToolbarLink icon={<Group />} tooltip="Users" to="/" />
      <ToolbarLink icon={<VideoCall />} tooltip="Meetings" to="/meetings" />
      <ToolbarLink icon={<Settings />} tooltip="Settings" to="/settings" />
      <ToolbarLink
        icon={<Logout />}
        tooltip="Logout"
        onClick={() => setOpen(true)}
      />
      <IconButton
        onClick={() => {}}
        sx={{
          backgroundColor: '#ef4848',
          color: 'white',
          '&:hover': {
            bgcolor: '#e03030',
            color: 'white',
          },
        }}>
        <Add />
      </IconButton>
    </Stack>
  );
};

export default Toolbar;
