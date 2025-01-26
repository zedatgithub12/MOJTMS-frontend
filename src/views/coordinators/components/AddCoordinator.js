import React, { useState } from 'react';
import Button from '@mui/material/Button';
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
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { IconX } from '@tabler/icons';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Connections from 'api';
import * as Yup from 'yup';

const CoordinatorScheme = Yup.object().shape({
    name: Yup.string().min(2, 'Too short for name').required('Name is required'),
    email: Yup.string().email('Invalid Email').required('Email is required')
});

export default function AddCoordinator({ open, handleDialogClose, onRefresh }) {
    const { t } = useTranslation();
    const theme = useTheme();

    const [department, setDepartment] = useState([]);
    const role = 'Coordinator';
    const password = 'coordinator12345';

    const FetchDepartments = async () => {
        var Api = Connections.api + Connections.departments + `/select`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const data = parsed.data;
            setDepartment(data);
        }
    };

    useQuery(['data'], () => FetchDepartments(), {
        refetchOnWindowFocus: false
    });

    const handleSubmitting = (values) => {
        setAdding(true);
        const token = sessionStorage.getItem('token');

        var Api = Connections.api + Connections.coordinators;
        var headers = {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        var data = {
            name: values?.name,
            email: values?.email,
            password: password,
            role: role,
            department_id: values?.department
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
                    onRefresh();
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
            role: 'Coordinator',
            department: ''
        },
        validationSchema: CoordinatorScheme,
        onSubmit: (values) => {
            handleSubmitting(values);
        }
    });

    const [adding, setAdding] = useState(formik.isSubmitting);

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
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
                        background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`
                    }}
                >
                    <DialogTitle variant="h4">{t('Add Coordinator')}</DialogTitle>

                    <IconButton onClick={handleDialogClose}>
                        <IconX size={20} />
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
                                value={formik.values.name}
                                name="name"
                                onChange={formik.handleChange}
                                label={t('Full name')}
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
                                value={formik.values.email}
                                name="email"
                                onChange={formik.handleChange}
                                label={t('Email Address')}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {t(formik.errors.email)}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={formik.touched.department && Boolean(formik.errors.department)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-department">
                                {formik.values.department ? '' : t('Department(Optional)')}
                            </InputLabel>
                            <Select
                                value={formik.values.department}
                                onChange={formik.handleChange}
                                id="outlined-adornment-department"
                                name="department"
                            >
                                {department.length === 0 ? (
                                    <Typography variant="body2" sx={{ padding: 1 }}>
                                        {t('Department is not found')}
                                    </Typography>
                                ) : (
                                    department.map((item, index) => (
                                        <MenuItem key={index} value={item.id} sx={{ paddingY: 2 }}>
                                            {item.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                            {formik.touched.department && formik.errors.department && (
                                <FormHelperText error id="standard-weight-helper-text">
                                    {t(formik.errors.department)}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Box>
                            <Typography variant="subtitle2" marginLeft={1} marginTop={1}>
                                {t('Default password')}
                            </Typography>
                            <Typography variant="body2" marginLeft={1}>
                                {password}
                            </Typography>
                        </Box>

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
                                    {adding ? <CircularProgress size={16} sx={{ color: theme.palette.background.default }} /> : t('Save')}
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

AddCoordinator.propTypes = {
    open: PropTypes.bool,
    handleDialogClose: PropTypes.func,
    onRefresh: PropTypes.func
};
