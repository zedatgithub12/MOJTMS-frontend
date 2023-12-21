import { useState } from 'react';
import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, TextField, Typography, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import Connections from 'api';
import AnimateButton from 'ui-component/extended/AnimateButton';
import PropTypes from 'prop-types';

//============================= CREATE MODULE COMPONENT ===========================//

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Module name is required').max(120),
    description: Yup.string().max(500)
});

const CreateModule = ({ training_id, sx, handleClosePanel }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    //submit the module to be create
    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);

        const Api = Connections.api + Connections.modules;
        const ActiveUser = JSON.parse(sessionStorage.getItem('user'));

        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('training_id', training_id);
        data.append('module_title', values.name);
        data.append('module_description', values.description);
        data.append('added_by', ActiveUser.user.id);

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
        initialValues: { name: '', description: '' },
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
        <Box sx={{ ...sx }}>
            <form noValidate onSubmit={formik.handleSubmit}>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={8}
                        xl={6}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid',
                            background: theme.palette.primary.light,
                            borderColor: theme.palette.primary[200],
                            borderRadius: 4,
                            padding: 2,
                            ':hover': {
                                boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                            }
                        }}
                    >
                        <Typography variant="h4" color="primary">
                            {t('Create module')}
                        </Typography>

                        <FormControl
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            sx={{ ...theme.typography.customInput, mt: 2 }}
                        >
                            <TextField
                                id="module-name"
                                name="name"
                                label={t('Module name')}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                inputProps={{}}
                                variant="standard"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <FormHelperText error id="standard-weight-helper-text-name">
                                    {t(formik.errors.name)}
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
                                label={t('Module description')}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                fullWidth
                                multiline
                                variant="standard"
                            />
                            {formik.touched.description && formik.errors.description && (
                                <FormHelperText error id="standard-weight-helper-text-name">
                                    {t(formik.errors.description)}
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
                                    {isSubmitting ? <CircularProgress size={22} sx={{ color: theme.palette.grey[700] }} /> : t('Submit')}
                                </Button>
                            </AnimateButton>

                            <Button variant="text" color="primary" sx={{ py: 1, px: 4, mt: 4, mx: 2 }} onClick={handleClosePanel}>
                                {t('Cancel')}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
            <SnackbarProvider maxSnack={3} />
        </Box>
    );
};

CreateModule.propTypes = {
    training_id: PropTypes.number,
    sx: PropTypes.object,
    handleClosePanel: PropTypes.func
};
export default CreateModule;
