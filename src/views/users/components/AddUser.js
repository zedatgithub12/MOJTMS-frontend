import React, { useState } from 'react';
import { Box, CircularProgress, FormControl, FormHelperText, IconButton, InputLabel, OutlinedInput, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { IconX } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Connections from 'api';

export default function AddUser({ open, handleDialogClose, onRefresh }) {
    const { t } = useTranslation();
    const theme = useTheme();

    const AddUserScheme = Yup.object().shape({
        name: Yup.string().min(2, 'Too short for name').required('Name is required'),
        email: Yup.string().email('Invalid Email').required('Email address is required')
    });

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
            password: values.password,
            role: values.role
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
                    onRefresh();
                } else {
                    setAdding(false);
                    handlePrompts(response.error, 'error');
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
            role: 'Admin',
            password: 'admin12345'
        },
        validationSchema: AddUserScheme,
        onSubmit: (values) => {
            handleSubmitting(values);
        }
    });

    const [adding, setAdding] = useState(formik.isSubmitting);

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(t(message), { variant });
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
                        backgroundColor: theme.palette.primary[200]
                    }}
                >
                    <DialogTitle variant="h4">{t('Add new user')}</DialogTitle>

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
                            <InputLabel htmlFor="outlined-adornment-name">{t('Full name')}</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-name"
                                type="text"
                                name="name"
                                label={t('Full name')}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                inputProps={{}}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <FormHelperText error id="standard-weight-helper-text-name">
                                    {t(formik.errors.name)}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-email">{t('Email address')}</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email"
                                type="email"
                                name="email"
                                label={t('Email Address')}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                inputProps={{}}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {t(formik.errors.email)}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 2 }}>
                            <Button onClick={handleDialogClose} variant="text" color="primary" sx={{ marginRight: 3 }}>
                                {t('Cancel')}
                            </Button>
                            <AnimateButton>
                                <Button
                                    disabled={adding ? true : false}
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ paddingX: 8, paddingY: 0.8 }}
                                >
                                    {adding ? <CircularProgress size={16} sx={{ color: theme.palette.background.default }} /> : t('Submit')}
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
    handleDialogClose: PropTypes.func,
    onRefresh: PropTypes.func
};
