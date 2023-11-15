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
    Select,
    MenuItem
} from '@mui/material';

// project imports
import { useFormik } from 'formik';
import { IconUpload } from '@tabler/icons';
import { IconLabel } from 'ui-component/content/IconLabel';
import { convertToMB, validateImage } from 'utils/functions';
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import { sizes } from 'constants';
import { useNavigate } from 'react-router';
import { useQuery } from 'react-query';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

import * as Yup from 'yup';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Connections from 'api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import TrainingLanguages from 'data/static/languages';

// ==============================|| ADD TRAINING PAGE ||============================== //

const validationSchema = Yup.object().shape({
    category: Yup.string().required('Training category is required'),
    name: Yup.string().required('Training title is required').max(80),
    language: Yup.string().required('Training language is required'),
    description: Yup.string().max(800),
    prerequisites: Yup.string().max(750)
});

const AddTraining = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const bigDevice = useMediaQuery(theme.breakpoints.up('md'));

    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageprompt, setImagePrompt] = useState({
        status: false,
        message: ''
    });
    const [ImageValidation, setImageValidation] = useState();
    const [categories, setCategories] = useState([]);

    //fetch categories and assign them to categories state and
    //map them on to the dropdown list
    const FetchCategory = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.categories;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const data = parsed.data.data;
            setCategories(data);
            setLoading(false);
        }
    };

    const { isLoading, error } = useQuery(['data'], () => FetchCategory(), {
        refetchOnWindowFocus: false
    });

    //handle the training thumbanail upload
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

    //submit the training to be added
    const handleSubmitting = (values) => {
        // Handle form submission here

        if (!thumbnail) {
            setImagePrompt({
                status: true,
                message: 'Please upload training thumbnail'
            });
        } else {
            setIsSubmitting(true);

            const Api = Connections.api + Connections.trainings;
            const token = sessionStorage.getItem('token');
            const headers = {
                Authorization: 'Bearer' + token
            };

            const data = new FormData();
            data.append('thumbnail', thumbnail);
            data.append('category', values.category);
            data.append('title', values.name);
            data.append('description', values.description);
            data.append('language', values.language);
            data.append('prerequisites', values.prerequisites);

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
        initialValues: { category: '', name: '', description: '', language: '', prerequisites: '' },
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
                <MiniHeader title="Add Training" back={true} sx={{ backgroundColor: theme.palette.secondary.dark }} />

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
                                                    <Typography variant="subtitle1">Upload Thumbnail</Typography>
                                                    <Typography variant="subtitle2">Image that emphesize the training</Typography>
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
                                            error={formik.touched.category && Boolean(formik.errors.category)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="outlined-adornment-category">
                                                {formik.values.category ? '' : 'Category'}
                                            </InputLabel>
                                            <Select
                                                value={formik.values.category}
                                                onChange={formik.handleChange}
                                                id="outlined-adornment-category"
                                                name="category"
                                            >
                                                {categories.length == 0 ? (
                                                    <Typography variant="body2" sx={{ padding: 1 }}>
                                                        Categories Not Found
                                                    </Typography>
                                                ) : (
                                                    categories.map((category, index) => (
                                                        <MenuItem key={index} value={category.name}>
                                                            {category.name}
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                            {formik.touched.category && formik.errors.category && (
                                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                                    {formik.errors.category}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="training-title">Training title</InputLabel>
                                            <OutlinedInput
                                                id="training-title"
                                                name="name"
                                                label="Training title"
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
                                            fullWidth
                                            error={formik.touched.language && Boolean(formik.errors.language)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="outlined-adornment-language">
                                                {formik.values.language ? '' : 'Language'}
                                            </InputLabel>
                                            <Select
                                                value={formik.values.language}
                                                onChange={formik.handleChange}
                                                name="language"
                                                id="outlined-adornment-language"
                                            >
                                                {TrainingLanguages.length == 0 ? (
                                                    <Typography variant="body2" sx={{ padding: 1 }}>
                                                        Language not found
                                                    </Typography>
                                                ) : (
                                                    TrainingLanguages.map((lang, index) => (
                                                        <MenuItem key={index} value={lang.name}>
                                                            {lang.name}
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                            {formik.touched.language && formik.errors.language && (
                                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                                    {formik.errors.language}
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
                                            <InputLabel htmlFor="training-description">Description </InputLabel>
                                            <OutlinedInput
                                                id="training-description"
                                                name="description"
                                                label="Description"
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
                                            error={formik.touched.prerequisites && Boolean(formik.errors.prerequisites)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="training-pre-requisites">Pre-requisites </InputLabel>
                                            <OutlinedInput
                                                id="training-pre-requisites"
                                                name="prerequisites"
                                                label="Pre-requisites"
                                                value={formik.values.prerequisites}
                                                onChange={formik.handleChange}
                                                fullWidth
                                                multiline
                                                rows={3}
                                                sx={{ marginTop: 1 }}
                                            />
                                            {formik.touched.prerequisites && formik.errors.prerequisites && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {formik.errors.prerequisites}
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
                                                    'Add Training'
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

export default AddTraining;
