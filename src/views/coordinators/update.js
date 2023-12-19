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
    Button
} from '@mui/material';
import Connections from 'api';
import { useFormik } from 'formik';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router';
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import * as Yup from 'yup';
import ELevel from 'data/static/ELevel';
import AnimateButton from 'ui-component/extended/AnimateButton';

const validationSchema = Yup.object().shape({
    phone: Yup.string().required('Phone is required'),
    gender: Yup.string().required('Gender is required')
});

const UpdateCoordinator = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();

    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);

        const Api = Connections.api + Connections.coordinators + '/' + state.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();

        data.append('gender', values.gender);
        data.append('phone', values.phone);
        data.append('address', values.address);
        data.append('education', values.education);

        fetch(Api, { method: 'POST', headers: headers, body: data })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setIsSubmitting(false);
                    handlePrompts(response.message, 'success');
                } else {
                    setIsSubmitting(false);
                    handlePrompts(response.error, 'error');
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                handlePrompts(error, 'error');
            });
    };

    const formik = useFormik({
        initialValues: {
            gender: state.gender ? state.gender : '',
            phone: state.phone ? state.phone : '',
            address: state.address ? state.address : '',
            education: state.education ? state.education : ''
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
                    marginBottom: 2,
                    minHeight: '50vh',
                    border: 1,
                    borderColor: theme.palette.primary[200],
                    borderRadius: 2
                }}
            >
                <MiniHeader
                    title="Update Profile"
                    back={true}
                    sx={{ background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})` }}
                />

                <Grid container>
                    <Grid item xs={12}>
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid container paddingX={5} paddingY={2} spacing={1}>
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
                                        error={formik.touched.education && Boolean(formik.errors.education)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="outlined-adornment-education">
                                            {formik.values.education ? '' : 'Education Level'}
                                        </InputLabel>
                                        <Select
                                            value={formik.values.education}
                                            onChange={formik.handleChange}
                                            name="education"
                                            id="outlined-adornment-education"
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

                                        {formik.touched.education && formik.errors.education && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {formik.errors.education}
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

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default UpdateCoordinator;
