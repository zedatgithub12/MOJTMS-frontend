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
    Button,
    Skeleton
} from '@mui/material';
import { Box } from '@mui/system';
import { IconArrowLeft } from '@tabler/icons';
import { useLocation, useNavigate } from 'react-router';

// project imports
import { useFormik } from 'formik';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Connections from 'api';

// ==============================|| CREATE SCHEDULE PAGE ||============================== //

const validationSchema = Yup.object().shape({
    scheduled_title: Yup.string().required('Schedule title is required'),
    startdate: Yup.date().required('Starting date & time is required'),
    enddate: Yup.date().required('End date & time is required')
});

const CreateSchedule = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [loading, setLoading] = useState(false);
    const [sessionInfo, setSessionInfo] = useState([]);

    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchSession();
        } else {
            FetchSession();
        }
    };

    const FetchSession = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.trainingsession + '/' + state;
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
            setSessionInfo(data.data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);

        const Api = Connections.api + Connections.schedules;
        const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
        const Addedby = ActiveUser.user.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('training_session_id', state);
        data.append('added_by', Addedby);
        data.append('scheduled_title', values.scheduled_title);
        data.append('schedule_description', values.scheduled_description);
        data.append('start_datetime', values.startdate);
        data.append('end_datetime', values.enddate);

        fetch(Api, { method: 'POST', headers: headers, body: data })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    handlePrompts(response.message, 'success');
                    setIsSubmitting(false);
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
            scheduled_title: '',
            scheduled_description: '',
            startdate: '',
            enddate: ''
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
                        <Box sx={{ width: '70%' }}>
                            <Typography variant="subtitle1" marginY={1}>
                                {t('Add schedule for')}
                            </Typography>

                            {loading ? (
                                <Skeleton variant="rectangular" width={'100%'} height={24} sx={{ borderRadius: 1 }} />
                            ) : (
                                <Typography variant="h3" color="primary">
                                    {t(sessionInfo.round_name)}
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
                                        error={formik.touched.scheduled_title && Boolean(formik.errors.scheduled_title)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="session-title">{t('Schedule title')}</InputLabel>
                                        <OutlinedInput
                                            id="session-title"
                                            name="scheduled_title"
                                            label={t('Schedule title')}
                                            value={formik.values.scheduled_title}
                                            onChange={formik.handleChange}
                                            fullWidth
                                            inputProps={{}}
                                        />
                                        {formik.touched.scheduled_title && formik.errors.scheduled_title && (
                                            <FormHelperText error id="standard-weight-helper-text-scheduled_title">
                                                {t(formik.errors.scheduled_title)}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.scheduled_description && Boolean(formik.errors.scheduled_description)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="scheduled_description">{t('Description')} </InputLabel>
                                        <OutlinedInput
                                            id="scheduled_description"
                                            name="scheduled_description"
                                            label={t('Description')}
                                            value={formik.values.scheduled_description}
                                            onChange={formik.handleChange}
                                            fullWidth
                                            multiline
                                            rows={6}
                                            sx={{ marginTop: 1 }}
                                        />
                                        {formik.touched.scheduled_description && formik.errors.scheduled_description && (
                                            <FormHelperText error id="standard-weight-helper-text-description">
                                                {t(formik.errors.scheduled_description)}
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
                                                    inputProps={{}}
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

export default CreateSchedule;
