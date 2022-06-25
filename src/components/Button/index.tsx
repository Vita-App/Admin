import React, { useState } from "react";
import { Button as MuiButton, Dialog, ButtonProps } from "@mui/material";
import ConfirmationModal from "components/Modals/ConfirmDialog";

interface Props extends ButtonProps {
  onClick?: () => void;
  withConfirmation?: boolean;
  loading?: boolean;
  title?: string;
  message?: string;
}

const Button: React.FC<Props> = ({
  children,
  withConfirmation,
  onClick,
  loading,
  title,
  message,
  ...props
}) => {
  const [open, setOpen] = useState(false);

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
        <MuiButton onClick={() => setOpen(true)} {...props}>
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
