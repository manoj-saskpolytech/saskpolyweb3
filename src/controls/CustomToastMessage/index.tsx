import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';

export interface IToastProps {
  message: string;
  messageType: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const CustomToastMessage: React.FC<IToastProps> = (props: IToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Automatically hide the toast after 3 seconds
    const timeout = setTimeout(() => {
      setVisible(false);
      props.onClose();
    }, 4000);
    return () => clearTimeout(timeout);
  }, [props]);

  const handleClose = () => {
    setVisible(false);
    props.onClose();
  };

  return (
    <Stack
      sx={{
        width: '100%',
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        left: 0,
        padding: '1rem',
        alignItems: 'center',
      }}
    >
      <Snackbar open={visible} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={props.messageType} sx={{ width: '100%' }}>
          {props.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default CustomToastMessage;
