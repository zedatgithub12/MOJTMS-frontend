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
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import { useNavigate } from 'react-router';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Connections from 'api';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

// ==============================|| CREATE ASSESSMENT PAGE ||============================== //

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Assessment name is required').max(80),
    description: Yup.string().required('Assessment description is required').min(15),
    duration: Yup.number().required('Assessment duration is required')
});

const CreateAssessment = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);
        const Api = Connections.api + Connections.assessments;
        const created_by = JSON.parse(sessionStorage.getItem('user'));
        const id = created_by.user.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('assessment_name', values.name);
        data.append('assessment_description', values.description);
        data.append('duration', values.duration);
        data.append('passing_score', values.score);
        data.append('instructions', values.instructions);
        data.append('created_by', id);
        data.append('status', 'draft');

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
        initialValues: { name: '', description: '', score: '', duration: '', instructions: '' },
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
                xl={6}
                sx={{
                    borderRadius: 4,
                    border: '2px solid',
                    background: theme.palette.primary.light,
                    borderColor: theme.palette.primary[200],
                    ':hover': {
                        boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                    }
                }}
            >
                <MiniHeader
                    title="Create Assessment"
                    back={true}
                    sx={{ background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.primary.main})` }}
                />

                <Grid container paddingTop={4}>
                    <Grid item xs={12} sx={{ padding: 2 }}>
                        <Grid container spacing={2}>
                            <form noValidate onSubmit={formik.handleSubmit}>
                                <Grid container paddingX={5} spacing={1}>
                                    <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="assessment-name">Name</InputLabel>
                                            <OutlinedInput
                                                id="assessment-name"
                                                name="name"
                                                label="Assessment name"
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
                                            error={formik.touched.description && Boolean(formik.errors.description)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="assessment-description">Description </InputLabel>
                                            <OutlinedInput
                                                id="assessment-description"
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
                                        <Grid continer sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                                {' '}
                                                <FormControl
                                                    fullWidth
                                                    error={formik.touched.score && Boolean(formik.errors.score)}
                                                    sx={{ ...theme.typography.customInput, marginRight: 3 }}
                                                >
                                                    <InputLabel htmlFor="assessment-score">Passing score out of 100 </InputLabel>
                                                    <OutlinedInput
                                                        id="assessment-score"
                                                        name="score"
                                                        label="Passing score"
                                                        value={formik.values.score}
                                                        onChange={formik.handleChange}
                                                        fullWidth
                                                    />
                                                    {formik.touched.score && formik.errors.score && (
                                                        <FormHelperText error id="standard-weight-helper-text-name">
                                                            {formik.errors.score}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                                                <FormControl
                                                    fullWidth
                                                    error={formik.touched.duration && Boolean(formik.errors.duration)}
                                                    sx={{ ...theme.typography.customInput }}
                                                >
                                                    <InputLabel htmlFor="assessment-duration">Duration in Minute </InputLabel>
                                                    <OutlinedInput
                                                        id="assessment-duration"
                                                        name="duration"
                                                        label="Duration"
                                                        value={formik.values.duration}
                                                        onChange={formik.handleChange}
                                                        fullWidth
                                                    />
                                                    {formik.touched.duration && formik.errors.duration && (
                                                        <FormHelperText error id="standard-weight-helper-text-name">
                                                            {formik.errors.duration}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.instructions && Boolean(formik.errors.instructions)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="assessment-instructions">Instructions (optional) </InputLabel>
                                            <OutlinedInput
                                                id="assessment-instructions"
                                                name="instructions"
                                                label="Instructions"
                                                value={formik.values.instructions}
                                                onChange={formik.handleChange}
                                                fullWidth
                                                multiline
                                                rows={6}
                                                sx={{ marginTop: 1 }}
                                            />
                                            {formik.touched.instructions && formik.errors.instructions && (
                                                <FormHelperText error id="standard-weight-helper-text-name">
                                                    {formik.errors.instructions}
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
                                            Cancel
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
                                                    'Save'
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

export default CreateAssessment;
