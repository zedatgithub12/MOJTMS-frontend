import { useState } from 'react';
// material-ui
import {
    Grid,
    Box,
    Typography,
    Button,
    useTheme,
    IconButton,
    useMediaQuery,
    CircularProgress,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';

// project imports
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IconUpload } from '@tabler/icons';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { IconLabel } from 'ui-component/content/IconLabel';
import { convertToMB, validateImage } from 'utils/functions';
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import { sizes } from 'settings';
import { useNavigate } from 'react-router';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Connections from 'api';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

// ==============================|| ADD DEPARTMENT PAGE ||============================== //
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Trainer name is required').max(80),
    email: Yup.string().email('Enter valid email').required('Trainer email is required'),
    biography: Yup.string().max(180)
});

const AddTrainer = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const bigDevice = useMediaQuery(theme.breakpoints.up('md'));

    const [thumbnail, setThumbnail] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageprompt, setImagePrompt] = useState({
        status: false,
        message: ''
    });
    const [ImageValidation, setImageValidation] = useState();
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setThumbnail(file);

        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
        }
        const validated = validateImage(file, sizes.image);
        setImageValidation(validated);
        setImagePrompt({
            status: false,
            message: ''
        });
    };

    const handleSubmitting = (values) => {
        // Handle form submission here

        if (!thumbnail) {
            setImagePrompt({
                status: true,
                message: 'Please upload trainer photo'
            });
        } else {
            setIsSubmitting(true);

            const Api = Connections.api + Connections.trainers;
            const token = sessionStorage.getItem('token');
            const headers = {
                Authorization: 'Bearer' + token
            };

            const data = new FormData();
            data.append('photo', thumbnail);
            data.append('name', values.name);
            data.append('gender', values.gender);
            data.append('email', values.email);
            data.append('phone', values.phone);
            data.append('address', values.address);
            data.append('qualifications', values.qualifications);
            data.append('specialisation', values.specialisation);
            data.append('biography', values.biography);
            data.append('languages', values.languages);
            data.append('linkedin_profile', values.linkedin_profile);

            console.log(data);

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
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            gender: '',
            email: '',
            phone: '',
            address: '',
            qualifications: '',
            specialisation: '',
            biography: '',
            languages: '',
            linkedin_profile: ''
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
        <Grid container sx={{ minHeight: 200, justifyContent: 'center' }}>
            <Grid
                item
                xs={12}
                sm={10}
                md={10}
                lg={8}
                xl={8}
                sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    background: theme.palette.secondary.light,
                    borderColor: theme.palette.primary[200] + 25,
                    ':hover': {
                        boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                    }
                }}
            >
                <MiniHeader title="Add Trainer" back={true} sx={{ backgroundColor: theme.palette.secondary.dark }} />

                <Grid container>
                    <Grid item xs={12} sx={{ padding: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={bigDevice ? 6 : 12}>
                                        <Box
                                            sx={{
                                                padding: 1,
                                                marginY: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {thumbnail ? (
                                                <Box
                                                    sx={{
                                                        width: 300,
                                                        height: 300,
                                                        alignSelf: 'center',
                                                        justifySelf: 'center'
                                                    }}
                                                >
                                                    <img
                                                        src={previewImage}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            aspectRatio: 1,
                                                            resize: 'contain',
                                                            borderRadius: 4
                                                        }}
                                                        alt="Thumbnail"
                                                    />
                                                </Box>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        width: 300,
                                                        height: 300,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        border: 1.8,
                                                        borderColor: theme.palette.primary.main,
                                                        borderStyle: 'dashed',
                                                        borderRadius: 3
                                                    }}
                                                >
                                                    <input
                                                        type="file"
                                                        name="thumbnail"
                                                        onChange={(event) => handleImageUpload(event)}
                                                        hidden
                                                        id="image-upload"
                                                    />
                                                    <label htmlFor="image-upload">
                                                        <IconButton component="span">
                                                            <IconUpload size={28} color={theme.palette.primary.main} />
                                                        </IconButton>
                                                    </label>
                                                    <Typography variant="subtitle1">Upload Picture</Typography>
                                                    <Typography variant="subtitle2">Image of trainer</Typography>
                                                </Box>
                                            )}
                                            {thumbnail && (
                                                <Box>
                                                    <input
                                                        type="file"
                                                        onChange={(event) => handleImageUpload(event)}
                                                        hidden
                                                        id="image-update"
                                                    />
                                                    <label htmlFor="image-update">
                                                        <Typography
                                                            variant="subtitle1"
                                                            color="secondary"
                                                            sx={{
                                                                marginTop: 2,
                                                                padding: 0.5,
                                                                paddingX: 6,
                                                                borderRadius: 1
                                                            }}
                                                        >
                                                            Update Picture
                                                        </Typography>
                                                    </label>
                                                </Box>
                                            )}
                                            {imageprompt.status && (
                                                <Typography variant="subtitle" color="error" marginY={2}>
                                                    {imageprompt.message}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>

                                    {bigDevice && (
                                        <Grid item xs={6}>
                                            <Box
                                                sx={{
                                                    paddingX: 2,
                                                    marginY: 2,
                                                    paddingY: 0.1
                                                }}
                                            >
                                                {thumbnail && ImageValidation && (
                                                    <Box>
                                                        <IconLabel content={thumbnail.name} label="File name">
                                                            <CheckCircleIcon size={16} color="secondary" />
                                                        </IconLabel>
                                                        <IconLabel content={thumbnail.type} label="Type">
                                                            {ImageValidation.type ? (
                                                                <CheckCircleIcon size={16} color="secondary" />
                                                            ) : (
                                                                <InfoIcon size={16} color="grey" />
                                                            )}
                                                        </IconLabel>

                                                        {ImageValidation.type && (
                                                            <IconLabel content={convertToMB(thumbnail.size)} label="Size">
                                                                {ImageValidation.size ? (
                                                                    <CheckCircleIcon size={16} color="secondary" />
                                                                ) : (
                                                                    <InfoIcon size={16} color="grey" />
                                                                )}
                                                            </IconLabel>
                                                        )}

                                                        {ImageValidation && (
                                                            <Typography variant="subtitle2" color="error">
                                                                {ImageValidation.message}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                )}
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>
                            <form noValidate onSubmit={formik.handleSubmit}>
                                <Grid container paddingX={5} spacing={1}>
                                    <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="trainer-name">Full name</InputLabel>
                                            <OutlinedInput
                                                id="trainer-name"
                                                name="name"
                                                label="trainer name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                fullWidth
                                                inputProps={{}}
                                            />
                                            {formik.touched.name && formik.errors.name && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {formik.errors.name}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl
                                            error={formik.touched.gender && Boolean(formik.errors.gender)}
                                            sx={{ marginLeft: 1.4 }}
                                        >
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
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="department-email">Email </InputLabel>
                                            <OutlinedInput
                                                id="department-email"
                                                name="email"
                                                label="Email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                fullWidth
                                            />
                                            {formik.touched.email && formik.errors.email && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {formik.errors.email}
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
                                            <InputLabel htmlFor="department-phone">Phone </InputLabel>
                                            <OutlinedInput
                                                id="department-phone"
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
                                            error={formik.touched.address && Boolean(formik.errors.address)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="trainer-address">Address </InputLabel>
                                            <OutlinedInput
                                                id="trainer-address"
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
                                        <Grid continer sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                                {' '}
                                                <FormControl
                                                    fullWidth
                                                    error={formik.touched.qualifications && Boolean(formik.errors.qualifications)}
                                                    sx={{ ...theme.typography.customInput, marginRight: 3 }}
                                                >
                                                    <InputLabel htmlFor="trainer-qualifications">Qualifications </InputLabel>
                                                    <OutlinedInput
                                                        id="trainer-qualifications"
                                                        name="qualifications"
                                                        label="Qualifications"
                                                        value={formik.values.qualifications}
                                                        onChange={formik.handleChange}
                                                        fullWidth
                                                    />
                                                    {formik.touched.qualifications && formik.errors.qualifications && (
                                                        <FormHelperText error id="standard-weight-helper-text-name">
                                                            {formik.errors.qualifications}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                                <FormControl
                                                    fullWidth
                                                    error={formik.touched.specialisation && Boolean(formik.errors.specialisation)}
                                                    sx={{ ...theme.typography.customInput }}
                                                >
                                                    <InputLabel htmlFor="trainer-specialisation">Specialisation </InputLabel>
                                                    <OutlinedInput
                                                        id="trainer-specialisation"
                                                        name="specialisation"
                                                        label="Specialisation"
                                                        value={formik.values.specialisation}
                                                        onChange={formik.handleChange}
                                                        fullWidth
                                                    />
                                                    {formik.touched.specialisation && formik.errors.specialisation && (
                                                        <FormHelperText error id="standard-weight-helper-text-name">
                                                            {formik.errors.specialisation}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.biography && Boolean(formik.errors.biography)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="trainer-bio">Biography </InputLabel>
                                            <OutlinedInput
                                                id="trainer-bio"
                                                name="bio"
                                                label="Bio"
                                                value={formik.values.biography}
                                                onChange={formik.handleChange}
                                                fullWidth
                                                multiline
                                                rows={6}
                                                sx={{ marginTop: 1 }}
                                            />
                                            {formik.touched.biography && formik.errors.biography && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {formik.errors.biography}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.languages && Boolean(formik.errors.languages)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="trainer-languages">Languages </InputLabel>
                                            <OutlinedInput
                                                id="trainer-languages"
                                                name="languages"
                                                label="Languages"
                                                value={formik.values.languages}
                                                onChange={formik.handleChange}
                                                fullWidth
                                            />
                                            {formik.touched.languages && formik.errors.languages && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {formik.errors.languages}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.linkedin_profile && Boolean(formik.errors.linkedin_profile)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="trainer-linkedin_profile">Linkedin Profile </InputLabel>
                                            <OutlinedInput
                                                id="trainer-linkedin_profile"
                                                name="linkedin_profile"
                                                label="linkedin Profile"
                                                value={formik.values.linkedin_profile}
                                                onChange={formik.handleChange}
                                                fullWidth
                                            />
                                            {formik.touched.linkedin_profile && formik.errors.linkedin_profile && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {formik.errors.linkedin_profile}
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
                                                color="secondary"
                                                sx={{ minWidth: 180, py: 1, px: 4, my: 2 }}
                                            >
                                                {isSubmitting ? (
                                                    <CircularProgress size={22} sx={{ color: theme.palette.background.default }} />
                                                ) : (
                                                    'Add Trainer'
                                                )}
                                            </Button>
                                        </AnimateButton>

                                        <Button
                                            variant="text"
                                            color="secondary"
                                            sx={{ py: 1, px: 4, my: 2, mx: 4 }}
                                            onClick={() => navigate(-1)}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default AddTrainer;
