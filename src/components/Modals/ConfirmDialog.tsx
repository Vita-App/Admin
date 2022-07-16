import React from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
} from '@mui/material';
import { TailSpin } from 'react-loader-spinner';
import { Warning } from '@mui/icons-material';

interface Props {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

const ConfirmDialog: React.FC<Props> = (props) => (
  <DialogContent sx={{ minWidth: '400px' }}>
    <Box display="flex" justifyContent="center">
      <Avatar
        sx={{
          width: '100px',
          height: '100px',
          backgroundColor: 'error.main',
        }}>
        <Warning sx={{ width: '80px', height: '80px' }} />
      </Avatar>
    </Box>
    <Typography variant="h4" color="error.main" textAlign="center" gutterBottom>
      <strong>{props.title}</strong>
    </Typography>
    <Typography variant="body1" color="textSecondary" textAlign="center" my={2}>
      {props.message}
    </Typography>
    <DialogActions>
      <Button
        onClick={props.onConfirm}
        variant="contained"
        disabled={props.loading}>
        {props.loading ? (
          <TailSpin width="25px" height="25px" color="#000" />
        ) : (
          'Okay'
        )}
      </Button>
      <Button onClick={props.onClose} variant="contained" color="error">
        Cancel
      </Button>
    </DialogActions>
  </DialogContent>
);

export default ConfirmDialog;
