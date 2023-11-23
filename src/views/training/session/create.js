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

// project imports
import Connections from 'api';
import { useQuery } from 'react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import AnimateButton from 'ui-component/extended/AnimateButton';
import AddedModal from './components/AddedModal';

// ==============================|| CREATE SESSION PAGE ||============================== //

const validationSchema = Yup.object().shape({
    session_name: Yup.string().required('Round name is required'),
    startdate: Yup.date().required('Starting date is required'),
    enddate: Yup.date().required('End date is required'),
    address: Yup.string().required('Training address is required')
});

const CreateSession = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [roundNumber, setRoundNumber] = useState();
    const [sessionData, setSessionData] = useState([]);
    const [open, setOpen] = useState(false);

    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            setRefreshed(true);
            fetchTrainingRound();
        } else {
            fetchTrainingRound();
        }
    };

    const fetchTrainingRound = async () => {
        var Api = Connections.api + Connections.round + state.id;
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
            setRoundNumber(data);
        }
    };

    const { isLoading, error } = useQuery(['data'], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    //round count formatter
    const FormattedRound = (number) => {
        var count;

        switch (number) {
            case 1:
                count = 'st';
                break;
            case 2:
                count = 'nd';
                break;
            case 3:
                count = 'rd';
                break;
            default:
                count = 'th';
                break;
        }
        return count;
    };

    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);

        const Api = Connections.api + Connections.trainingsession;
        const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
        const Addedby = ActiveUser.user.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('training_id', state.id);
        data.append('training_name', state.title);
        data.append('added_by', Addedby);
        data.append('round_number', roundNumber);
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
                    setSessionData(response.data);
                    setOpen(true);
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
            session_name: '',
            session_description: '',
            startdate: '',
            enddate: '',
            address: '',
            maximum_capacity: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmitting(values);
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(formik.isSubmitting);

    const handleClose = () => {
        setOpen(false);
    };

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
                                {state.title}
                            </Typography>
                            {state.description && (
                                <Typography
                                    variant="body2"
                                    marginTop={1}
                                    sx={{ maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                >
                                    {state.description}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12} sx={{ padding: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} paddingX={5}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: 50,
                                    minHeight: 40,
                                    borderRadius: 3,
                                    padding: 1,
                                    backgroundColor: theme.palette.primary[200],
                                    marginRight: 2
                                }}
                            >
                                {roundNumber && (
                                    <Typography variant="h4" color="primary">
                                        {roundNumber} <sup>{FormattedRound(roundNumber)}</sup>
                                    </Typography>
                                )}
                            </Box>
                            <Typography variant="h4">Round</Typography>
                        </Box>

                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid container paddingX={5} paddingY={2} spacing={1}>
                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.session_name && Boolean(formik.errors.session_name)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="session-name">Session name</InputLabel>
                                        <OutlinedInput
                                            id="session-name"
                                            name="session_name"
                                            label="Session name"
                                            value={formik.values.session_name}
                                            onChange={formik.handleChange}
                                            fullWidth
                                            inputProps={{}}
                                        />
                                        {formik.touched.session_name && formik.errors.session_name && (
                                            <FormHelperText error id="standard-weight-helper-text-session_name">
                                                {formik.errors.session_name}
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
                                        <InputLabel htmlFor="session_description">Description </InputLabel>
                                        <OutlinedInput
                                            id="session_description"
                                            name="session_description"
                                            label="Description"
                                            value={formik.values.session_description}
                                            onChange={formik.handleChange}
                                            fullWidth
                                            multiline
                                            rows={6}
                                            sx={{ marginTop: 1 }}
                                        />
                                        {formik.touched.session_description && formik.errors.session_description && (
                                            <FormHelperText error id="standard-weight-helper-text-name">
                                                {formik.errors.session_description}
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
                                                <InputLabel htmlFor="startdate">Start date & time</InputLabel>
                                                <OutlinedInput
                                                    id="startdate"
                                                    type="datetime-local"
                                                    name="startdate"
                                                    label="startdate"
                                                    value={formik.values.startdate}
                                                    onChange={formik.handleChange}
                                                    fullWidth
                                                    inputProps={{}}
                                                    sx={{ marginTop: 1 }}
                                                />
                                                {formik.touched.startdate && formik.errors.startdate && (
                                                    <FormHelperText error id="standard-weight-helper-text-startdate">
                                                        {formik.errors.startdate}
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
                                                <InputLabel htmlFor="enddate">End date & time</InputLabel>
                                                <OutlinedInput
                                                    id="enddate"
                                                    type="datetime-local"
                                                    name="enddate"
                                                    label="enddate"
                                                    value={formik.values.enddate}
                                                    onChange={formik.handleChange}
                                                    fullWidth
                                                    inputProps={{}}
                                                    sx={{ marginTop: 1 }}
                                                />
                                                {formik.touched.enddate && formik.errors.enddate && (
                                                    <FormHelperText error id="standard-weight-helper-text-enddate">
                                                        {formik.errors.enddate}
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
                                        <InputLabel htmlFor="training-address">Address </InputLabel>
                                        <OutlinedInput
                                            id="training-address"
                                            name="address"
                                            label="Address"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            fullWidth
                                        />
                                        {formik.touched.address && formik.errors.address && (
                                            <FormHelperText error id="standard-weight-helper-text-name">
                                                {formik.errors.address}
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
                                        <InputLabel htmlFor="trainee-maximum_capacity">Maximum capacity </InputLabel>
                                        <OutlinedInput
                                            id="trainee-maximum_capacity"
                                            name="maximum_capacity"
                                            label="Maximum capacity"
                                            value={formik.values.maximum_capacity}
                                            onChange={formik.handleChange}
                                            fullWidth
                                        />
                                        {formik.touched.maximum_capacity && formik.errors.maximum_capacity && (
                                            <FormHelperText error id="standard-weight-helper-text-name">
                                                {formik.errors.maximum_capacity}
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
                                                'Submit'
                                            )}
                                        </Button>
                                    </AnimateButton>

                                    <Button variant="text" color="primary" sx={{ py: 1, px: 4, my: 2, mx: 4 }} onClick={() => navigate(-1)}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Grid>
            <AddedModal
                open={open}
                handleClose={handleClose}
                onContinue={() => navigate('/training/session/detail', { state: sessionData })}
            />
            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default CreateSession;
