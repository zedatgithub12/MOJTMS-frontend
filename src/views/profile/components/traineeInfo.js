import { useState } from 'react';
import {
    Grid,
    useTheme,
    CircularProgress,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    MenuItem,
    Button,
    Box,
    Divider,
    IconButton,
    Typography
} from '@mui/material';
import { IconX } from '@tabler/icons';
import { useFormik } from 'formik';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import Connections from 'api';
import PropTypes from 'prop-types';
import ListingComponent from './listingComponent';
import * as Yup from 'yup';
import ELevel from 'data/static/ELevel';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { DateFormatter } from 'utils/functions';

const validationSchema = Yup.object().shape({
    date_of_birth: Yup.date().required('Birth date is required'),
    phone: Yup.string().required('Phone is required'),
    gender: Yup.string().required('Gender is required')
});

const TraineeInfo = ({ traineeInfo, onRefresh }) => {
    const theme = useTheme();
    const [edit, setEdit] = useState(false);

    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);

        const Api = Connections.api + Connections.trainee + '/' + traineeInfo.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('date_of_birth', values.date_of_birth);
        data.append('gender', values.gender);
        data.append('phone', values.phone);
        data.append('address', values.address);
        data.append('job_title', values.job_title);
        data.append('education_level', values.education_level);

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
            date_of_birth: traineeInfo.date_of_birth ? traineeInfo.date_of_birth : '',
            gender: traineeInfo.gender ? traineeInfo.gender : '',
            phone: traineeInfo.phone ? traineeInfo.phone : '',
            address: traineeInfo.address ? traineeInfo.address : '',
            job_title: traineeInfo.job_title ? traineeInfo.job_title : '',
            education_level: traineeInfo.education_level ? traineeInfo.education_level : ''
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
                borderRadius: 2,
                border: 1,
                borderColor: theme.palette.grey[300],
                // backgroundColor: theme.palette.grey[100],
                marginY: 2
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
                    <Typography variant="h4">More details</Typography>
                    {edit ? (
                        <IconButton onClick={() => setEdit(!edit)}>
                            <IconX size={20} />
                        </IconButton>
                    ) : (
                        <Button onClick={() => setEdit(!edit)}>Edit</Button>
                    )}
                </Box>
                <Divider />

                <Box>
                    {edit ? (
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid container paddingX={5} paddingY={2} spacing={1}>
                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.date_of_birth && Boolean(formik.errors.date_of_birth)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="date_of_birth">Birth Date</InputLabel>
                                        <OutlinedInput
                                            id="date_of_birth"
                                            type="date"
                                            name="date_of_birth"
                                            label="date_of_birth"
                                            value={formik.values.date_of_birth}
                                            onChange={formik.handleChange}
                                            fullWidth
                                            inputProps={{}}
                                        />
                                        {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                                            <FormHelperText error id="standard-weight-helper-text-date_of_birth">
                                                {formik.errors.date_of_birth}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl error={formik.touched.gender && Boolean(formik.errors.gender)} sx={{ marginLeft: 1.4 }}>
                                        <FormLabel id="gender">Gender</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="gender"
                                            name="gender"
                                            value={formik.values.gender}
                                            onChange={formik.handleChange}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-around'
                                            }}
                                        >
                                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.address && Boolean(formik.errors.address)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="trainee-address">Address </InputLabel>
                                        <OutlinedInput
                                            id="trainee-address"
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
                                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="trainee-phone">Phone </InputLabel>
                                        <OutlinedInput
                                            id="trainee-phone"
                                            name="phone"
                                            label="Phone"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            fullWidth
                                        />
                                        {formik.touched.phone && formik.errors.phone && (
                                            <FormHelperText error id="standard-weight-helper-text-name">
                                                {formik.errors.phone}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.job_title && Boolean(formik.errors.job_title)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="trainee-position">Job Position</InputLabel>
                                        <OutlinedInput
                                            id="trainee-job-title"
                                            name="job_title"
                                            label="trainee Position"
                                            value={formik.values.job_title}
                                            onChange={formik.handleChange}
                                            fullWidth
                                            inputProps={{}}
                                        />
                                        {formik.touched.job_title && formik.errors.job_title && (
                                            <FormHelperText error id="standard-weight-helper-text-job_title">
                                                {formik.errors.job_title}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.education_level && Boolean(formik.errors.education_level)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-education_level">
                                            {formik.values.education_level ? '' : 'Education Level'}
                                        </InputLabel>
                                        <Select
                                            value={formik.values.education_level}
                                            onChange={formik.handleChange}
                                            name="education_level"
                                            id="outlined-adornment-education_level"
                                        >
                                            {ELevel.length == 0 ? (
                                                <Typography variant="body2" sx={{ padding: 1 }}>
                                                    Education level is not found
                                                </Typography>
                                            ) : (
                                                ELevel.map((item, index) => (
                                                    <MenuItem key={index} value={item.value}>
                                                        {item.value}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>

                                        {formik.touched.education_level && formik.errors.education_level && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {formik.errors.education_level}
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
                                                'Done'
                                            )}
                                        </Button>
                                    </AnimateButton>

                                    <Button
                                        variant="text"
                                        color="primary"
                                        sx={{ py: 1, px: 4, my: 2, mx: 4 }}
                                        onClick={() => setEdit(!edit)}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    ) : (
                        <div>
                            <ListingComponent content={DateFormatter(traineeInfo.date_of_birth)} label="Birth date" />
                            <ListingComponent content={traineeInfo.gender} label="Gender" />
                            <ListingComponent content={traineeInfo.phone} label="Phone" />
                            <ListingComponent content={traineeInfo.address} label="Address" />
                            <ListingComponent content={traineeInfo.education_level} label="Education Level" />
                            <ListingComponent content={traineeInfo.job_title} label="Job Title" />
                            <ListingComponent content={DateFormatter(traineeInfo.created_at)} label="Joined on" />
                        </div>
                    )}
                </Box>
            </Grid>

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

TraineeInfo.propTypes = {
    traineeInfo: PropTypes.oneOfType([PropTypes.object], [PropTypes.array]),
    onRefresh: PropTypes.func
};

export default TraineeInfo;
