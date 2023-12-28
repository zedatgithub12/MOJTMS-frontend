import { useState } from 'react';
// material-ui
import {
    Grid,
    Button,
    useTheme,
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
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import { useNavigate } from 'react-router';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Connections from 'api';
import * as Yup from 'yup';

// ==============================|| CREATE SURVEY PAGE ||============================== //

const SurveyTypes = ['Training', 'Trainer'];

const validationSchema = Yup.object().shape({
    type: Yup.string().required('Survey type is required'),
    title: Yup.string().required('Survey title is required'),
    description: Yup.string().required('Survey description is required')
});

const CreateSurvey = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    const handleSubmitting = (values) => {
        // Handle form submission here
        setIsSubmitting(true);
        const Api = Connections.api + Connections.surveys;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('type', values.type);
        data.append('title', values.title);
        data.append('description', values.description);
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
        initialValues: { type: SurveyTypes[0], title: '', description: '' },
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
                    title="Create Survey"
                    back={true}
                    sx={{ background: `linear-gradient(to left, ${theme.palette.secondary.light}, ${theme.palette.primary[200]})` }}
                />

                <Grid container paddingTop={4}>
                    <Grid item xs={12} sx={{ padding: 2 }}>
                        <Grid container spacing={2}>
                            <form noValidate onSubmit={formik.handleSubmit}>
                                <Grid container paddingX={5} spacing={1}>
                                    <Grid item xs={12}>
                                        <InputLabel htmlFor="outlined-adornment-type" sx={{ padding: 0.5 }}>
                                            {t('Survey Type')}
                                        </InputLabel>
                                        <Select
                                            value={formik.values.type}
                                            onChange={formik.handleChange}
                                            id="outlined-adornment-type"
                                            name="type"
                                            error={formik.touched.type && Boolean(formik.errors.type)}
                                            sx={{ width: '40%' }}
                                        >
                                            {SurveyTypes.length == 0 ? (
                                                <Typography variant="body2" sx={{ padding: 1 }}>
                                                    {t('Question Type Not Found')}
                                                </Typography>
                                            ) : (
                                                SurveyTypes.map((type, index) => (
                                                    <MenuItem key={index} value={type}>
                                                        {t(type)}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                        {formik.touched.type && formik.errors.type && (
                                            <FormHelperText error id="standard-weight-helper-text-question-type">
                                                {t(formik.errors.type)}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} sx={{ marginTop: 1 }}>
                                        <FormControl
                                            fullWidth
                                            error={formik.touched.title && Boolean(formik.errors.title)}
                                            sx={{ ...theme.typography.customInput }}
                                        >
                                            <InputLabel htmlFor="survey-title">{t('Survey Title')}</InputLabel>
                                            <OutlinedInput
                                                id="survey-title"
                                                name="title"
                                                label={t('Survey Title')}
                                                value={formik.values.title}
                                                onChange={formik.handleChange}
                                                fullWidth
                                            />
                                            {formik.touched.title && formik.errors.title && (
                                                <FormHelperText error id="standard-weight-helper-text-title">
                                                    {t(formik.errors.title)}
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
                                            <InputLabel htmlFor="survey-description">{t('Description')} </InputLabel>
                                            <OutlinedInput
                                                id="survey-description"
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
                                                    {t(formik.errors.description)}
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
                                                    t('Save')
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

export default CreateSurvey;
