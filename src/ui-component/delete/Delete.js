import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

export const Delete = ({ open, title, description, handleClose, onNo, onYes, deleting }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <React.Fragment>
            <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <DialogTitle variant="h4" color="primaey" id="responsive-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText variant="body1">{description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onNo} color="dark">
                        No
                    </Button>
                    <Button onClick={onYes} color="error">
                        {deleting ? <CircularProgress size={16} sx={{ color: theme.palette.error.main }} /> : 'Yes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};
