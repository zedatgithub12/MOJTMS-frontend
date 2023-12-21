import { useState } from 'react';

// material-ui
import {
    Grid,
    IconButton,
    Typography,
    useTheme,
    CircularProgress,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Button
} from '@mui/material';
import { Box } from '@mui/system';
import { IconArrowLeft } from '@tabler/icons';
import { useLocation, useNavigate } from 'react-router';
import { useFormik } from 'formik';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// project imports
import Connections from 'api';
import * as Yup from 'yup';
import AnimateButton from 'ui-component/extended/AnimateButton';

// ==============================|| UPDATE SESSION PAGE ||============================== //

const validationSchema = Yup.object().shape({
    session_name: Yup.string().required('Round name is required'),
    startdate: Yup.date().required('Starting date and time is required'),
    enddate: Yup.date().required('End date and time is required'),
    address: Yup.string().required('Training address is required')
});

const UpdateSession = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();

    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);

        const Api = Connections.api + Connections.trainingsession + '/' + state.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('round_name', values.session_name);
        data.append('round_description', values.session_description);
        data.append('start_date', values.startdate);
        data.append('end_date', values.enddate);
        data.append('address', values.address);
        data.append('maximum_capacity', values.maximum_capacity);

        fetch(Api, { method: 'POST', headers: headers, body: data })
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
            .catch((error) => {
                setIsSubmitting(false);
                handlePrompts(error, 'error');
            });
    };

    //handle a training session creating form down here
    const formik = useFormik({
        initialValues: {
            session_name: state ? state.round_name : '',
            session_description: state ? state.round_description : '',
            startdate: state ? state.start_date : '',
            enddate: state ? state.end_date : '',
            address: state ? state.address : '',
            maximum_capacity: state ? state.maximum_capacity : ''
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
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
            }}
        >
            <Grid
                item
                xs={11}
                sm={10}
                md={10}
                lg={6}
                xl={6}
                sx={{
                    minHeight: '74vh',
                    borderRadius: 2,
                    border: '1px solid',
                    background: theme.palette.primary.light,
                    borderColor: theme.palette.primary[200],
                    ':hover': {
                        boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                    }
                }}
            >
                <Grid
                    container
                    sx={{
                        background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`,
                        minHeight: 140,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4
                    }}
                >
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', px: 2, pt: 1 }}>
                        <IconButton onClick={() => navigate(-1)}>
                            <IconArrowLeft color={theme.palette.grey[500]} />
                        </IconButton>
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginY: 4 }}>
                        <Box>
                            <Typography variant="h2" color="primary">
                                {t(state.round_name)}
                            </Typography>
                            {state.round_description && (
                                <Typography
                                    variant="body2"
                                    marginTop={1}
                                    sx={{ maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                >
                                    {t(state.round_description)}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12} sx={{ padding: 2 }}>
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid container paddingX={5} paddingY={2} spacing={1}>
                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.session_name && Boolean(formik.errors.session_name)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="session-name">{t('Session name')}</InputLabel>
                                        <OutlinedInput
                                            id="session-name"
                                            name="session_name"
                                            label={t('Session name')}
                                            value={formik.values.session_name}
                                            onChange={formik.handleChange}
                                            fullWidth
                                        />
                                        {formik.touched.session_name && formik.errors.session_name && (
                                            <FormHelperText error id="standard-weight-helper-text-session_name">
                                                {t(formik.errors.session_name)}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.session_description && Boolean(formik.errors.session_description)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="session_description">{t('Description')} </InputLabel>
                                        <OutlinedInput
                                            id="session_description"
                                            name="session_description"
                                            label={t('Description')}
                                            value={formik.values.session_description}
                                            onChange={formik.handleChange}
                                            fullWidth
                                            multiline
                                            rows={6}
                                            sx={{ marginTop: 1 }}
                                        />
                                        {formik.touched.session_description && formik.errors.session_description && (
                                            <FormHelperText error id="standard-weight-helper-text-name">
                                                {t(formik.errors.session_description)}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Grid
                                        container
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Grid item xs={12} sm={12} md={5.6} lg={5.6} xl={5.6}>
                                            <FormControl
                                                fullWidth
                                                error={formik.touched.startdate && Boolean(formik.errors.startdate)}
                                                sx={{ ...theme.typography.customInput }}
                                            >
                                                <InputLabel htmlFor="startdate">{t('Start date & time')}</InputLabel>
                                                <OutlinedInput
                                                    id="startdate"
                                                    type="datetime-local"
                                                    name="startdate"
                                                    label={t('Starting date')}
                                                    value={formik.values.startdate}
                                                    onChange={formik.handleChange}
                                                    fullWidth
                                                    sx={{ marginTop: 1 }}
                                                />
                                                {formik.touched.startdate && formik.errors.startdate && (
                                                    <FormHelperText error id="standard-weight-helper-text-startdate">
                                                        {t(formik.errors.startdate)}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={5.6} lg={5.6} xl={5.6}>
                                            <FormControl
                                                fullWidth
                                                error={formik.touched.enddate && Boolean(formik.errors.enddate)}
                                                sx={{ ...theme.typography.customInput }}
                                            >
                                                <InputLabel htmlFor="enddate">{t('End date & time')}</InputLabel>
                                                <OutlinedInput
                                                    id="enddate"
                                                    type="datetime-local"
                                                    name="enddate"
                                                    label={t('End date')}
                                                    value={formik.values.enddate}
                                                    onChange={formik.handleChange}
                                                    fullWidth
                                                    sx={{ marginTop: 1 }}
                                                />
                                                {formik.touched.enddate && formik.errors.enddate && (
                                                    <FormHelperText error id="standard-weight-helper-text-enddate">
                                                        {t(formik.errors.enddate)}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.address && Boolean(formik.errors.address)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="training-address">{t('Address')} </InputLabel>
                                        <OutlinedInput
                                            id="training-address"
                                            name="address"
                                            label={'Address'}
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            fullWidth
                                        />
                                        {formik.touched.address && formik.errors.address && (
                                            <FormHelperText error id="standard-weight-helper-text-name">
                                                {t(formik.errors.address)}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.maximum_capacity && Boolean(formik.errors.maximum_capacity)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="trainee-maximum_capacity">{t('Maximum capacity')} </InputLabel>
                                        <OutlinedInput
                                            id="trainee-maximum_capacity"
                                            name="maximum_capacity"
                                            label={t('Maximum capacity')}
                                            value={formik.values.maximum_capacity}
                                            onChange={formik.handleChange}
                                            fullWidth
                                        />
                                        {formik.touched.maximum_capacity && formik.errors.maximum_capacity && (
                                            <FormHelperText error id="standard-weight-helper-text-name">
                                                {theme(formik.errors.maximum_capacity)}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <AnimateButton>
                                        <Button
                                            disabled={isSubmitting ? true : false}
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            sx={{ minWidth: 180, py: 1, px: 4, my: 2 }}
                                        >
                                            {isSubmitting ? (
                                                <CircularProgress size={22} sx={{ color: theme.palette.background.default }} />
                                            ) : (
                                                t('Submit')
                                            )}
                                        </Button>
                                    </AnimateButton>

                                    <Button variant="text" color="primary" sx={{ py: 1, px: 4, my: 2, mx: 4 }} onClick={() => navigate(-1)}>
                                        {t('Cancel')}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Grid>

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default UpdateSession;
