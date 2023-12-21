import {
    Grid,
    Dialog,
    IconButton,
    Typography,
    useTheme,
    Divider,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    Select,
    MenuItem,
    Button
} from '@mui/material';
import { Box } from '@mui/system';
import { IconPlus, IconX } from '@tabler/icons';
import Connections from 'api';
import axios from 'axios';
import FileTypes from 'data/static/fileTypes';
import TrainingLanguages from 'data/static/languages';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import AnimateButton from 'ui-component/extended/AnimateButton';
import LinearProgressWithLabel from 'utils/components/LinearProgressWithValue';
import { convertToMB } from 'utils/functions';
import { validateFile } from 'utils/functions/validation';
import * as Yup from 'yup';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Material name is required').max(80),
    language: Yup.string().required('Material language is required'),
    description: Yup.string()
});

export const AddMaterial = ({ module_id, open, handleClose, sx }) => {
    const theme = useTheme();
    const [material, setMaterial] = useState(null);
    const [type, setType] = useState('upload');
    const [extension, setExtension] = useState();
    const [size, setSize] = useState();
    const [fileValidation, setFileValidation] = useState({
        status: true,
        message: ''
    });
    const [uploadProgress, setUploadProgress] = useState(0);

    //handle the training thumbanail upload
    const handleUploadMaterial = (event) => {
        const file = event.target.files[0];
        setMaterial(file);
        //take the file type and slice the first part
        // this update the file type icon shown on the home page
        const type = file.type.split('/')[0];
        const ext = file.type.split('/')[1];
        const filesize = convertToMB(file.size);
        setType(type);
        setExtension(ext);
        setSize(filesize);

        // File name length validation
        if (file.name.length > 90) {
            setFileValidation({
                status: false,
                message: 'File name exceeds the maximum length of 90 characters'
            });

            return;
        }

        // File name format validation
        const validExtensions = ['.png', '.jpeg', '.jpg', '.doc', '.pdf', '.xls', '.xlsl', '.csv', '.ppt', '.mp4', '.mp3', '.opus'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
            setFileValidation({
                status: false,
                message: 'Please upload a file with a valid extension'
            });
            return;
        }

        // additional file validation
        const validation = validateFile(file);
        setFileValidation({
            status: validation.status,
            message: validation.message
        });
    };

    const MaterialType = FileTypes.find((file) => file.name === type);

    //submit the material to be added
    const handleSubmitting = (values) => {
        // Handle form submission here
        if (material && fileValidation.status) {
            setIsSubmitting(true);

            const Api = Connections.api + Connections.materials;
            const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
            const token = sessionStorage.getItem('token');
            const headers = {
                Authorization: 'Bearer' + token
            };

            const data = new FormData();
            data.append('module_id', module_id);
            data.append('added_by', ActiveUser.user.id);
            data.append('title', values.name);
            data.append('description', values.description);
            data.append('language', values.language);
            data.append('file', material);
            data.append('file_size', size);
            data.append('file_type', type);

            axios
                .post(Api, data, {
                    headers: headers,
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setUploadProgress(progress);
                    }
                })
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
                    handlePrompts(error.message, 'error');
                });
        } else {
            handlePrompts('Please upload a file.', 'error');
        }
    };

    const formik = useFormik({
        initialValues: { name: '', description: '', language: '' },
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
        <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <Grid container sx={{ ...sx }}>
                <Grid item xs={12} sx={{ minHeight: '500px', width: 600 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 1.6,
                            background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`
                        }}
                    >
                        <Typography variant="h4">Add material</Typography>{' '}
                        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 6, right: 10 }}>
                            <IconX size={22} />
                        </IconButton>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`,
                            paddingY: 2,
                            paddingX: 5
                        }}
                    >
                        <Box>
                            <input type="file" name="material" onChange={(event) => handleUploadMaterial(event)} hidden id="file-upload" />
                            <label htmlFor="file-upload">
                                <Box
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: 3,
                                        borderStyle: 'dashed',
                                        borderColor: theme.palette.grey[200],
                                        borderRadius: 3,
                                        boxShadow: 1,
                                        margin: 1.6,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {MaterialType ? MaterialType.icon : <IconPlus size={24} />}

                                    {MaterialType && MaterialType.name !== 'upload' && (
                                        <Typography variant="subtitle2">{type == 'application' ? 'Document' : type}</Typography>
                                    )}
                                </Box>
                            </label>
                        </Box>

                        {material && (
                            <Box sx={{ margin: 1.6 }}>
                                <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {material.name.length > 60 ? `${material.name.slice(0, 50)}...` : material.name}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingY: 1
                                    }}
                                >
                                    <Typography variant="body2">{extension} </Typography>{' '}
                                    {size && (
                                        <Divider orientation="vertical" flexItem sx={{ color: theme.palette.primary.main, marginX: 2 }} />
                                    )}
                                    <Typography variant="body2" sx={{}}>
                                        {size}
                                    </Typography>
                                </Box>

                                <FormHelperText error id="standard-weight-helper-text">
                                    {fileValidation.message}
                                </FormHelperText>
                            </Box>
                        )}
                    </Box>

                    <form noValidate onSubmit={formik.handleSubmit}>
                        <Grid container paddingX={5} spacing={1} paddingY={1}>
                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="material-name">Material name</InputLabel>
                                    <OutlinedInput
                                        id="material-name"
                                        name="name"
                                        label="Material-name"
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
                                    <InputLabel htmlFor="material-description">Description (optional) </InputLabel>
                                    <OutlinedInput
                                        id="material-description"
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
                            <Grid
                                item
                                xs={12}
                                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <Box sx={{ width: '100%' }}>
                                    {uploadProgress == 100 ? (
                                        <Typography variant="subtitle2">Uploaded</Typography>
                                    ) : (
                                        uploadProgress > 0 && <Typography variant="subtitle2">Uploading...</Typography>
                                    )}
                                    {uploadProgress > 0 && uploadProgress <= 100 && <LinearProgressWithLabel value={uploadProgress} />}
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Button variant="text" color="secondary" sx={{ py: 1, px: 4, my: 2, mx: 4 }} onClick={handleClose}>
                                        Cancel
                                    </Button>
                                    <AnimateButton>
                                        <Button
                                            disabled={isSubmitting ? true : false}
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            sx={{ minWidth: 180, py: 1, px: 4, my: 2 }}
                                        >
                                            Add Material
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Grid>
                        </Grid>
                        <SnackbarProvider maxSnack={3} />
                    </form>
                </Grid>
            </Grid>
        </Dialog>
    );
};

AddMaterial.propTypes = {
    module_id: PropTypes.number,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    sx: PropTypes.object
};
