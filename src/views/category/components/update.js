import React, { useState } from 'react';
import { Box, CircularProgress, FormControl, FormHelperText, InputLabel, OutlinedInput, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Connections from 'api';

export default function UpdateCategory({ open, handleDialogClose, selectedCat, onRefresh }) {
    const { t } = useTranslation();
    const theme = useTheme();

    const AddUserScheme = Yup.object().shape({
        name: Yup.string().required('Category name is required')
    });

    const handleSubmitting = (values) => {
        setAdding(true);
        const token = sessionStorage.getItem('token');

        var Api = Connections.api + Connections.categories + '/' + selectedCat.id;
        var headers = {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        var data = {
            name: values.name,
            description: values.description
        };

        fetch(Api, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setAdding(false);
                    handleDialogClose();
                    handlePrompts(response.message, 'success');
                    onRefresh();
                } else {
                    setAdding(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setAdding(false);
                handlePrompts(error.message, 'error');
            });
    };

    const formik = useFormik({
        initialValues: {
            name: selectedCat.name,
            description: selectedCat.description
        },
        validationSchema: AddUserScheme,
        onSubmit: (values) => {
            handleSubmitting(values);
        }
    });

    const [adding, setAdding] = useState(formik.isSubmitting);

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(t(message), { variant });
    };

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle variant="h4">{t('Update Category')}</DialogTitle>
                <DialogContent>
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <FormControl
                            fullWidth
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            sx={{ ...theme.typography.customInput, marginTop: 2 }}
                        >
                            <InputLabel htmlFor="outlined-adornment-name">{t('Category name')}</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-name"
                                label={t('Category name')}
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <FormHelperText error id="standard-weight-helper-text-name">
                                    {t(formik.errors.name)}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-name">{t('Description')}</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-name"
                                type="text"
                                label={t('Description')}
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                multiline
                                rows={4}
                                sx={{ marginTop: 1 }}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <FormHelperText error id="standard-weight-helper-text-name">
                                    {t(formik.errors.description)}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                            <AnimateButton>
                                <Button
                                    disabled={adding ? true : false}
                                    size="small"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ paddingX: 6, paddingY: 0.8 }}
                                >
                                    {adding ? <CircularProgress size={16} sx={{ color: theme.palette.background.default }} /> : t('Update')}
                                </Button>
                            </AnimateButton>

                            <Button onClick={handleDialogClose} variant="text" color="primary" sx={{ marginLeft: 3 }}>
                                {t('Cancel')}
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
            <SnackbarProvider maxSnack={3} />
        </React.Fragment>
    );
}
