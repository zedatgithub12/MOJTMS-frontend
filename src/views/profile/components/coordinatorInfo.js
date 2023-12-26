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
import { DateFormatter } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import PropTypes from 'prop-types';
import ListingComponent from './listingComponent';
import * as Yup from 'yup';
import ELevel from 'data/static/ELevel';
import AnimateButton from 'ui-component/extended/AnimateButton';

const validationSchema = Yup.object().shape({
    phone: Yup.string().required('Phone is required'),
    gender: Yup.string().required('Gender is required')
});

const CoordinatorInfo = ({ coordinatorinfo, onRefresh }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [edit, setEdit] = useState(false);

    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);

        const Api = Connections.api + Connections.coordinators + '/' + coordinatorinfo.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('gender', values.gender);
        data.append('phone', values.phone);
        data.append('address', values.address);
        data.append('education', values.education_level);

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
            date_of_birth: coordinatorinfo.date_of_birth ? coordinatorinfo.date_of_birth : '',
            gender: coordinatorinfo.gender ? coordinatorinfo.gender : '',
            phone: coordinatorinfo.phone ? coordinatorinfo.phone : '',
            address: coordinatorinfo.address ? coordinatorinfo.address : '',
            job_title: coordinatorinfo.job_title ? coordinatorinfo.job_title : '',
            education_level: coordinatorinfo.education_level ? coordinatorinfo.education_level : ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmitting(values);
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(formik.isSubmitting);

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(t(message), { variant });
    };

    return (
        <Grid
            container
            sx={{
                borderRadius: 2,
                border: 1,
                borderColor: theme.palette.grey[300],
                // backgroundColor: theme.palette.grey[100],
                marginTop: 2
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
                    <Typography variant="h4">{t('More details')}</Typography>
                    {edit ? (
                        <IconButton onClick={() => setEdit(!edit)}>
                            <IconX size={20} />
                        </IconButton>
                    ) : (
                        <Button onClick={() => setEdit(!edit)}>{t('Edit')}</Button>
                    )}
                </Box>
                <Divider />

                <Box>
                    {edit ? (
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid container paddingX={5} paddingY={2} spacing={1}>
                                <Grid item xs={12}>
                                    <FormControl error={formik.touched.gender && Boolean(formik.errors.gender)} sx={{ marginLeft: 1.4 }}>
                                        <FormLabel id="gender">{t('Gender')}</FormLabel>
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
                                            <FormControlLabel value="male" control={<Radio />} label={t('Male')} />
                                            <FormControlLabel value="female" control={<Radio />} label={t('Female')} />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        error={formik.touched.address && Boolean(formik.errors.address)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="trainee-address">{t('Address')} </InputLabel>
                                        <OutlinedInput
                                            id="trainee-address"
                                            name="address"
                                            label={t('Address')}
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
                                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                                        sx={{ ...theme.typography.customInput }}
                                    >
                                        <InputLabel htmlFor="trainee-phone">{t('Phone')} </InputLabel>
                                        <OutlinedInput
                                            id="trainee-phone"
                                            name="phone"
                                            label={t('Phone')}
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            fullWidth
                                        />
                                        {formik.touched.phone && formik.errors.phone && (
                                            <FormHelperText error id="standard-weight-helper-text-name">
                                                {t(formik.errors.phone)}
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
                                            {formik.values.education_level ? '' : t('Education Level')}
                                        </InputLabel>
                                        <Select
                                            value={formik.values.education_level}
                                            onChange={formik.handleChange}
                                            name="education_level"
                                            id="outlined-adornment-education_level"
                                        >
                                            {ELevel.length == 0 ? (
                                                <Typography variant="body2" sx={{ padding: 1 }}>
                                                    {t('Education level is not found')}
                                                </Typography>
                                            ) : (
                                                ELevel.map((item, index) => (
                                                    <MenuItem key={index} value={item.value}>
                                                        {t(item.value)}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>

                                        {formik.touched.education_level && formik.errors.education_level && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {t(formik.errors.education_level)}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
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
                                                        t('Done')
                                                    )}
                                                </Button>
                                            </AnimateButton>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                                            <Button
                                                variant="text"
                                                color="primary"
                                                fullWidth
                                                sx={{ py: 1, px: 4, my: 2 }}
                                                onClick={() => setEdit(!edit)}
                                            >
                                                {t('Cancel')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    ) : (
                        <div>
                            {coordinatorinfo.gender && <ListingComponent content={coordinatorinfo.gender} label="Gender" />}
                            {coordinatorinfo.phone && <ListingComponent content={coordinatorinfo.phone} label="Phone" />}
                            {coordinatorinfo.address && <ListingComponent content={coordinatorinfo.address} label="Address" />}
                            {coordinatorinfo.education_level && (
                                <ListingComponent content={coordinatorinfo.education_level} label="Education Level" />
                            )}

                            {coordinatorinfo.created_at && (
                                <ListingComponent content={DateFormatter(coordinatorinfo.created_at)} label="Joined on" />
                            )}
                        </div>
                    )}
                </Box>
            </Grid>

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

CoordinatorInfo.propTypes = {
    coordinatorinfo: PropTypes.oneOfType([PropTypes.object], [PropTypes.array]),
    onRefresh: PropTypes.func
};

export default CoordinatorInfo;
