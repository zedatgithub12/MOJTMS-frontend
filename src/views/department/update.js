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
    FormHelperText
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
import { sizes } from 'constants';
import { useLocation, useNavigate } from 'react-router';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Connections from 'api';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// ==============================|| UPDATE DEPARTMENT PAGE ||============================== //
const validationSchema = Yup.object().shape({
    name: Yup.string().required('Department name is required').max(80)
});

const UpdateDepartment = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();

    const bigDevice = useMediaQuery(theme.breakpoints.up('md'));
    const ImageApi = Connections.thumbnails;

    const [thumbnail, setThumbnail] = useState(null);
    const [previewImage, setPreviewImage] = useState(state ? ImageApi + state.thumbnail : null);
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

        setIsSubmitting(true);

        const Api = Connections.api + Connections.departments + '/' + state.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('thumbnail', thumbnail);
        data.append('name', values.name);
        data.append('description', values.description);
        data.append('email', values.email);
        data.append('phone', values.phone);

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

    const formik = useFormik({
        initialValues: { name: state.name, description: state.description, email: state.email, phone: state.phone },
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
                    borderRadius: 2,
                    border: '1px solid',
                    background: theme.palette.primary.light,
                    borderColor: theme.palette.primary[200],
                    ':hover': {
                        boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                    }
                }}
            >
                <MiniHeader
                    title="Update Department"
                    back={true}
                    sx={{ background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})` }}
                />

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
                                            {state.thumbnail || thumbnail ? (
                                                <Box
                                                    sx={{
                                                        width: 300,
                                                        height: 300,
                                                        alignSelf: 'center',
                                                        justifySelf: 'center',
                                                        borderRadius: 2,
                                                        border: '1px solid',
                                                        background: theme.palette.primary.light,
                                                        borderColor: theme.palette.primary[200],
                                                        boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
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
                                                        alt={t('Thumbnail')}
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
                                                        name={t('thumbnail')}
                                                        onChange={(event) => handleImageUpload(event)}
                                                        hidden
                                                        id="image-upload"
                                                    />
                                                    <label htmlFor="image-upload">
                                                        <IconButton component="span">
                                                            <IconUpload size={28} color={theme.palette.primary.main} />
                                                        </IconButton>
                                                    </label>
                                                    <Typography variant="subtitle1">{t('Upload Thumbnail')}</Typography>
                                                    <Typography variant="subtitle2">{t('Image that emphesize the department')}</Typography>
                                                </Box>
                                            )}
                                            {state.thumbnail && (
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
                                                            {t('Change Thumbnail')}
                                                        </Typography>
                                                    </label>
                                                </Box>
                                            )}
                                            {imageprompt.status && (
                                                <Typography variant="subtitle" color="error" marginY={2}>
                                                    {t(imageprompt.message)}
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
                                                                {t(ImageValidation.message)}
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
                                            <InputLabel htmlFor="department-name">{t('Department name')}</InputLabel>
                                            <OutlinedInput
                                                id="department-name"
                                                name="name"
                                                label={t('Department name')}
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                fullWidth
                                                inputProps={{}}
                                            />
                                            {formik.touched.name && formik.errors.name && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {t(formik.errors.name)}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.description && Boolean(formik.errors.description)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="department-description">{t('Description')} </InputLabel>
                                            <OutlinedInput
                                                id="department-description"
                                                name="description"
                                                label={t('Description')}
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                fullWidth
                                                multiline
                                                rows={6}
                                                sx={{ marginTop: 1 }}
                                            />
                                            {formik.touched.description && formik.errors.description && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {formik.errors.description}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="department-email">{t('Email')} </InputLabel>
                                            <OutlinedInput
                                                id="department-email"
                                                name="email"
                                                label={t('Email')}
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                fullWidth
                                            />
                                            {formik.touched.email && formik.errors.email && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {t(formik.errors.email)}
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
                                            <InputLabel htmlFor="department-phone">{t('Phone')} </InputLabel>
                                            <OutlinedInput
                                                id="department-phone"
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

                                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="text"
                                            color="primary"
                                            sx={{ py: 1, px: 4, my: 2, mx: 4 }}
                                            onClick={() => navigate(-1)}
                                        >
                                            {t('Cancel')}
                                        </Button>

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
                                                    t('Update Department')
                                                )}
                                            </Button>
                                        </AnimateButton>
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

export default UpdateDepartment;
