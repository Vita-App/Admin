import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button as MuiButton, Dialog, ButtonProps } from '@mui/material';
import ConfirmationModal from 'components/Modals/ConfirmDialog';

interface Props extends ButtonProps {
  onClick?: () => void;
  withConfirmation?: boolean;
  loading?: boolean;
  openDialog?: boolean;
  setOpenDialog?: Dispatch<SetStateAction<boolean>>;
  title?: string;
  message?: string;
}

const Button: React.FC<Props> = ({
  children,
  openDialog,
  withConfirmation,
  onClick,
  loading,
  title,
  setOpenDialog,
  message,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openDialog !== undefined) {
      setOpen(openDialog);
    }
  }, [openDialog]);

  if (withConfirmation) {
    return (
      <>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <ConfirmationModal
            onClose={() => setOpen(false)}
            loading={loading}
            title={title!}
            message={message!}
            onConfirm={onClick!}
          />
        </Dialog>
        <MuiButton
          onClick={() => {
            setOpen(true);
            setOpenDialog && setOpenDialog(true);
          }}
          {...props}>
          {children}
        </MuiButton>
      </>
    );
  }

  return (
    <MuiButton onClick={onClick} {...props}>
      {children}
    </MuiButton>
  );
};

export default Button;
