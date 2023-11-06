import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import {
    Box,
    CircularProgress,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
    useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { Roles } from 'data/tables/Roles';
import Connections from 'api';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { IconX } from '@tabler/icons';

export default function AddUser({ open, handleDialogClose }) {
    const theme = useTheme();

    const [role, setRole] = useState('Coordinator');
    const [password, setPassword] = useState('coordinator12345');

    const AddUserScheme = Yup.object().shape({
        name: Yup.string().min(2, 'Too short for name').max(50, 'Name cannot exceed 50 characters').required('Name is required'),
        email: Yup.string().email('Invalid Email').required('Email is required')
    });

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const handleSubmitting = (values) => {
        setAdding(true);
        const token = sessionStorage.getItem('token');

        var Api = Connections.api + Connections.users;
        var headers = {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        var data = {
            name: values.name,
            email: values.email,
            password: password,
            role: role
        };

        fetch(Api, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setAdding(false);
                    handleDialogClose();
                    handlePrompts(response.message, 'success');
                } else {
                    setAdding(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setAdding(false);
                handlePrompts(error.message, 'error');
            });
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            role: 'Coordinator'
        },
        validationSchema: AddUserScheme,
        onSubmit: (values) => {
            handleSubmitting(values);
        }
    });

    const [adding, setAdding] = useState(formik.isSubmitting);

    const handleRoleSelection = (event) => {
        setRole(event.target.value);
        if (event.target.value == 'Admin') {
            setPassword('admin12345');
        } else if (event.target.value == 'Coordinator') {
            setPassword('coordinator12345');
        }
    };

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleDialogClose}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: 1,
                        backgroundColor: theme.palette.secondary.dark
                    }}
                >
                    <DialogTitle variant="h4" color="white">
                        Add new user
                    </DialogTitle>

                    <IconButton onClick={handleDialogClose}>
                        <IconX size={22} />
                    </IconButton>
                </Box>

                <DialogContent sx={{ minWidth: 500 }}>
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <FormControl
                            fullWidth
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            sx={{ ...theme.typography.customInput, marginTop: 2 }}
                        >
                            <InputLabel htmlFor="outlined-adornment-name">Full name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-name"
                                type="text"
                                value={formik.values.name}
                                name="name"
                                onChange={formik.handleChange}
                                label="Full name"
                                inputProps={{}}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <FormHelperText error id="standard-weight-helper-text-name">
                                    {formik.errors.name}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-email">Email address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email"
                                type="email"
                                value={formik.values.email}
                                name="email"
                                onChange={formik.handleChange}
                                label="Email Address"
                                inputProps={{}}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {formik.errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={formik.touched.role && Boolean(formik.errors.role)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-email">{role ? '' : 'Role'}</InputLabel>
                            <Select value={role} onChange={(event) => handleRoleSelection(event)}>
                                {Roles.map((role, index) => (
                                    <MenuItem key={index} value={role.name}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.role && formik.errors.role && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {formik.errors.role}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Box component={'paper'}>
                            <Typography variant="subtitle2" marginLeft={1} marginTop={1}>
                                Default password for {role}
                            </Typography>
                            <Typography variant="body2" marginLeft={1}>
                                {password}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 2 }}>
                            <Button onClick={handleDialogClose} variant="text" color="secondary" sx={{ marginRight: 3 }}>
                                Cancel
                            </Button>
                            <AnimateButton>
                                <Button
                                    disabled={adding ? true : false}
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    sx={{ paddingX: 8, paddingY: 0.8 }}
                                >
                                    {adding ? <CircularProgress size={16} sx={{ color: theme.palette.background.default }} /> : 'Save'}
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
            <SnackbarProvider maxSnack={3} />
        </React.Fragment>
    );
}

AddUser.propTypes = {
    open: PropTypes.bool,
    handleDialogClose: PropTypes.func
};
