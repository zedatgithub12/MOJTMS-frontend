import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

export default function MyDialog({ open, handleDialogClose }) {
    const theme = useTheme();

    const AddUserScheme = Yup.object.shape({
        name: Yup.string().min(2, 'Too short for name').max(50, 'Name cannot exceed 50 characters').required('Name is required'),
        email: Yup.string().email('Invalid Email').required('Email is required'),
        role: Yup.string().required('Role is required')
    });
    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle variant="subtitle1" color="white" sx={{ padding: 2, backgroundColor: theme.palette.secondary.dark }}>
                    Add new user
                </DialogTitle>
                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        role: '',
                        status: ''
                    }}
                    validationSchema={AddUserScheme}
                    onSubmit={(values) => {
                        console.log('submitting');
                    }}
                ></Formik>
                <DialogContent sx={{ minWidth: 500 }}>
                    <TextField margin="dense" id="name" label="Name" type="text" fullWidth variant="outlined" />
                    <TextField margin="dense" id="email" label="Email Address" type="email" fullWidth variant="outlined" />
                    <TextField margin="dense" id="role" label="Role" type="email" fullWidth variant="outlined" />
                    <TextField margin="dense" id="status" label="Email Address" type="email" fullWidth variant="outlined" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} variant="text">
                        Cancel
                    </Button>
                    <Button onClick={handleDialogClose} variant="contained" sx={{ marginRight: 1, paddingX: 4 }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

MyDialog.propTypes = {
    open: PropTypes.bool,
    handleDialogClose: PropTypes.func
};
