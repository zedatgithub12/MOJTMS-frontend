import { useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import { IconX } from '@tabler/icons';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import * as Yup from 'yup';
import AnimateButton from 'ui-component/extended/AnimateButton';
import PropTypes from 'prop-types';
import Connections from 'api';

//============================= UPDATE MODULE COMPONENT ===========================//

const validationSchema = Yup.object().shape({
    name: Yup.string().max(120),
    description: Yup.string().max(500)
});

const UpdateModule = ({ module, sx, handleClosePanel }) => {
    const theme = useTheme();

    //submit the module to be create
    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);

        const Api = Connections.api + Connections.modules + '/' + module.id;

        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('module_title', values.name);
        data.append('module_description', values.description);

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
        initialValues: { name: module.module_title, description: module.module_description },
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
        <Box sx={{ ...sx, zIndex: 2 }}>
            <form noValidate onSubmit={formik.handleSubmit}>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        sx={{
                            minWidth: 440,
                            display: 'flex',
                            flexDirection: 'column',
                            border: 0.5,
                            background: theme.palette.primary.light,
                            borderColor: theme.palette.primary[800],
                            borderRadius: 4,
                            padding: 2,
                            ':hover': {
                                boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                            }
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingRight: 1
                            }}
                        >
                            <Typography variant="h4" color="primary">
                                Update module
                            </Typography>
                            <IconButton onClick={handleClosePanel}>
                                <IconX size={20} />
                            </IconButton>
                        </Box>

                        <FormControl
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            sx={{ ...theme.typography.customInput, mt: 2 }}
                        >
                            <TextField
                                id="module-name"
                                name="name"
                                label="Module name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                inputProps={{}}
                                variant="standard"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <FormHelperText error id="standard-weight-helper-text-name">
                                    {formik.errors.name}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            sx={{ ...theme.typography.customInput, mt: 3 }}
                        >
                            <TextField
                                id="module-description"
                                name="description"
                                label="Module description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                fullWidth
                                multiline
                                variant="standard"
                            />
                            {formik.touched.description && formik.errors.description && (
                                <FormHelperText error id="standard-weight-helper-text-name">
                                    {formik.errors.description}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Box item xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                            <AnimateButton>
                                <Button
                                    disabled={isSubmitting ? true : false}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ py: 1, px: 4, mt: 4 }}
                                >
                                    {isSubmitting ? <CircularProgress size={22} sx={{ color: theme.palette.grey[700] }} /> : 'Update'}
                                </Button>
                            </AnimateButton>
                            <Button variant="text" color="primary" sx={{ py: 1, px: 4, mt: 4, mx: 2 }} onClick={handleClosePanel}>
                                Cancel
                            </Button>
                        </Box>
                    </Grid>
                    <SnackbarProvider maxSnack={3} />
                </Grid>
            </form>
        </Box>
    );
};

UpdateModule.propTypes = {
    module: PropTypes.object,
    sx: PropTypes.object,
    handleClosePanel: PropTypes.func
};
export default UpdateModule;
