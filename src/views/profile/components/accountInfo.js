import { useState } from 'react';
import {
    Grid,
    Box,
    Button,
    Typography,
    useTheme,
    Divider,
    FormControl,
    FormHelperText,
    CircularProgress,
    InputLabel,
    OutlinedInput,
    IconButton
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Connections from 'api';
import PropTypes from 'prop-types';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { IconX } from '@tabler/icons';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('New full name is required')
});

const AccountInfo = ({ userInfo, onRefresh }) => {
    const theme = useTheme();

    const [edit, setEdit] = useState(false);

    //a handle trainee name update
    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);

        const Api = Connections.api + Connections.traineename + '/' + userInfo.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('name', values.name);

        fetch(Api, { method: 'POST', headers: headers, body: data })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setIsSubmitting(false);
                    handlePrompts(response.message, 'success');
                    onRefresh();
                } else {
                    setIsSubmitting(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                handlePrompts(error, 'error');
            });
    };

    const formik = useFormik({
        initialValues: {
            name: userInfo ? userInfo.name : ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmitting(values);
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(formik.isSubmitting);

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    return (
        <>
            {edit ? (
                <form noValidate onSubmit={formik.handleSubmit}>
                    <Grid
                        container
                        sx={{
                            borderRadius: 2,
                            border: 1,
                            borderColor: theme.palette.grey[300],
                            backgroundColor: theme.palette.grey[100]
                        }}
                    >
                        <Grid item xs={12} marginBottom={2}>
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
                                <Typography variant="h4">Account Settings</Typography>
                                <Box>
                                    <IconButton onClick={() => setEdit(!edit)}>
                                        <IconX size={20} />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Divider />
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    marginY: 2,
                                    paddingX: 3
                                }}
                            >
                                <FormControl
                                    fullWidth
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="user-name">Full name</InputLabel>
                                    <OutlinedInput
                                        id="user-name"
                                        name="name"
                                        label="user name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        fullWidth
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <FormHelperText error id="standard-weight-helper-text-name">
                                            {formik.errors.name}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Box>

                            <Grid container paddingX={3}>
                                <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ paddingX: 6 }}>
                                        {isSubmitting ? (
                                            <CircularProgress size={18} sx={{ color: theme.palette.background.default }} />
                                        ) : (
                                            'Done'
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            ) : (
                <Grid
                    container
                    sx={{
                        borderRadius: 2,
                        border: 1,
                        borderColor: theme.palette.grey[300],
                        backgroundColor: theme.palette.grey[100]
                    }}
                >
                    <Grid item xs={12} marginBottom={2}>
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
                            <Typography variant="h4">Account Settings</Typography>
                            <Button onClick={() => setEdit(!edit)}>Edit</Button>
                        </Box>
                        <Divider />
                        {userInfo && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    marginY: 2,
                                    paddingX: 3
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ marginBottom: 0.5 }}>
                                    {userInfo.name}
                                </Typography>
                                <Typography color="grey"> Name </Typography>
                            </Box>
                        )}

                        {userInfo && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    marginY: 2,
                                    paddingX: 3
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ marginBottom: 0.5 }}>
                                    {userInfo.email}
                                </Typography>
                                <Typography color="grey"> Email address</Typography>
                            </Box>
                        )}

                        {userInfo && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    marginY: 2,
                                    paddingX: 3
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ marginBottom: 0.5 }}>
                                    {userInfo.role}
                                </Typography>
                                <Typography color="grey"> Role</Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            )}

            <SnackbarProvider maxSnack={3} />
        </>
    );
};

AccountInfo.propTypes = {
    userInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onRefresh: PropTypes.func
};

export default AccountInfo;
