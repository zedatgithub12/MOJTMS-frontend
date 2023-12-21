import * as React from 'react';
import { Dialog } from '@mui/material';
import PropTypes from 'prop-types';

export default function InfoDialog({ open, handleClose, children }) {
    return (
        <Dialog open={open} onClose={handleClose} aria-describedby="alert-dialog-slide-description">
            {children}
        </Dialog>
    );
}

InfoDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    children: PropTypes.node
};
