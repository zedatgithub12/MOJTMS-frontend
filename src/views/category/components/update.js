import React, { useState } from 'react';
import { Box, CircularProgress, FormControl, FormHelperText, InputLabel, OutlinedInput, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Connections from 'api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

export default function UpdateCategory({ open, handleDialogClose, selectedCat, onRefresh }) {
    const theme = useTheme();

    const AddUserScheme = Yup.object().shape({
        name: Yup.string().min(2, 'Too short for name').max(50, 'Name cannot exceed 50 characters').required('Name is required')
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
        enqueueSnackbar(message, { variant });
    };

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle variant="h4">Update Category</DialogTitle>
                <DialogContent>
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <FormControl
                            fullWidth
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            sx={{ ...theme.typography.customInput, marginTop: 2 }}
                        >
                            <InputLabel htmlFor="outlined-adornment-name">Category name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-name"
                                type="text"
                                value={formik.values.name}
                                name="name"
                                onChange={formik.handleChange}
                                label="Name"
                                inputProps={{}}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <FormHelperText error id="standard-weight-helper-text-name">
                                    {formik.errors.name}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-name">Category description</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-name"
                                type="text"
                                value={formik.values.description}
                                name="description"
                                onChange={formik.handleChange}
                                label="Description"
                                inputProps={{}}
                                multiline
                                rows={4}
                                sx={{ marginTop: 1 }}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <FormHelperText error id="standard-weight-helper-text-name">
                                    {formik.errors.description}
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
                                    {adding ? <CircularProgress size={16} sx={{ color: theme.palette.background.default }} /> : 'Update'}
                                </Button>
                            </AnimateButton>

                            <Button onClick={handleDialogClose} variant="text" color="primary" sx={{ marginLeft: 3 }}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
            <SnackbarProvider maxSnack={3} />
        </React.Fragment>
    );
}
