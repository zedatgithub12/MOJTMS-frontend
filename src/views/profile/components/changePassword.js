import { useState } from 'react';
import { Grid, Box, CircularProgress, Divider, Button, TextField, IconButton, InputAdornment, Typography, useTheme } from '@mui/material';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import { useFormik } from 'formik';
import {} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import * as Yup from 'yup';
import Connections from 'api';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current Password is required'),
    newPassword: Yup.string().required('New Password is required').min(4, 'New Password must be at least 4 characters'),
    confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

const ChangePassword = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [expand, setExpand] = useState(false);

    // Handle form submission
    const handleSubmit = (values) => {
        setIsSubmitting(true);

        let user = JSON.parse(sessionStorage.getItem('user'));

        var Api = Connections.api + Connections.changepass + user.user.id;
        const token = sessionStorage.getItem('token');

        const headers = {
            Authorization: 'Bearer' + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        var data = {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword
        };

        fetch(Api, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setIsSubmitting(false);
                    handlePrompts(response.message, 'success');
                } else {
                    setIsSubmitting(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch(() => {
                setIsSubmitting(false);
            });
    };

    // useFormik hook
    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema,
        onSubmit: handleSubmit
    });

    const [isSubmitting, setIsSubmitting] = useState(formik.isSubmitting);
    // State for controlling field visibility
    const [showPassword, setShowPassword] = useState(false);

    // Toggle field visibility
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    return (
        <Grid
            container
            sx={{
                borderRadius: 2,
                border: 1,
                borderColor: theme.palette.grey[300],
                marginTop: 2,
                marginBottom: 4
            }}
        >
            <Grid item xs={12}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginY: 2,
                        paddingX: 3
                    }}
                >
                    <Typography variant="h4">{t('Change Password')}</Typography>
                    <IconButton onClick={() => setExpand(!expand)}>
                        {expand ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
                    </IconButton>
                </Box>
                <Divider />

                {expand && (
                    <Grid container>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                marginY: 2,
                                paddingX: 3
                            }}
                        >
                            <form onSubmit={formik.handleSubmit}>
                                <Box sx={{ paddingY: 1.5 }}>
                                    <TextField
                                        name="currentPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        label={t('Current Password')}
                                        variant="outlined"
                                        fullWidth
                                        {...formik.getFieldProps('currentPassword')}
                                        error={formik.touched.currentPassword && t(formik.errors.currentPassword)}
                                        helperText={formik.touched.currentPassword && t(formik.errors.currentPassword)}
                                    />
                                </Box>
                                <Box sx={{ paddingY: 1.5 }}>
                                    <TextField
                                        name="newPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        label={t('New Password')}
                                        variant="outlined"
                                        fullWidth
                                        {...formik.getFieldProps('newPassword')}
                                        error={formik.touched.newPassword && t(formik.errors.newPassword)}
                                        helperText={formik.touched.newPassword && t(formik.errors.newPassword)}
                                    />
                                </Box>
                                <Box sx={{ paddingY: 1.5 }}>
                                    <TextField
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        label={t('Confirm Password')}
                                        variant="outlined"
                                        fullWidth
                                        {...formik.getFieldProps('confirmPassword')}
                                        error={formik.touched.confirmPassword && t(formik.errors.confirmPassword)}
                                        helperText={formik.touched.confirmPassword && t(formik.errors.confirmPassword)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleTogglePassword} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Box>

                                <Grid container>
                                    <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                                        <AnimateButton>
                                            <Button
                                                disabled={isSubmitting ? true : false}
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                sx={{ py: 1, px: 4, my: 2 }}
                                            >
                                                {isSubmitting ? (
                                                    <CircularProgress size={22} sx={{ color: theme.palette.background.default }} />
                                                ) : (
                                                    t('Change Password')
                                                )}
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                )}
            </Grid>

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default ChangePassword;
