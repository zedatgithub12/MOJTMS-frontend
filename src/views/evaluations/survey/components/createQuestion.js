import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
    useTheme
} from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import AnimateButton from 'ui-component/extended/AnimateButton';
import * as Yup from 'yup';
import SQTypes from 'data/static/SQTypes';
import PropTypes from 'prop-types';

const validationSchema = Yup.object().shape({
    question_type: Yup.string().required('Question type is required'),
    question: Yup.string().required('Question is required').max(250)
});

const CreateQuestion = ({ isSubmitting, handleSubmission, handleClose }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    //submit the question to be added
    const handleSubmitting = (values) => {
        // Handle form submission here
        handleSubmission(values);
    };

    const formik = useFormik({
        initialValues: { question_type: 'true/false', question: '' },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmitting(values);
        }
    });

    return (
        <Box>
            <Typography variant="h3" marginBottom={2}>
                {t('Create Question')}
            </Typography>

            <form noValidate onSubmit={formik.handleSubmit}>
                <FormControl
                    error={formik.touched.question_type && Boolean(formik.errors.question_type)}
                    sx={{ ...theme.typography.customInput }}
                >
                    <InputLabel htmlFor="outlined-adornment-question_type">{formik.values.question_type ? '' : t('Type')}</InputLabel>
                    <Select
                        value={formik.values.question_type}
                        onChange={formik.handleChange}
                        id="outlined-adornment-question_type"
                        name="question_type"
                    >
                        {SQTypes.length == 0 ? (
                            <Typography variant="body2" sx={{ padding: 1 }}>
                                {t('Question Type Not Found')}
                            </Typography>
                        ) : (
                            SQTypes.map((type, index) => (
                                <MenuItem key={index} value={type.name}>
                                    {t(type.label)}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                    {formik.touched.question_type && formik.errors.question_type && (
                        <FormHelperText error id="standard-weight-helper-text-question-type">
                            {t(formik.errors.question_type)}
                        </FormHelperText>
                    )}
                </FormControl>

                <FormControl
                    fullWidth
                    error={formik.touched.question && Boolean(formik.errors.question)}
                    sx={{ ...theme.typography.customInput }}
                >
                    <InputLabel htmlFor="question">{t('Question')}</InputLabel>
                    <OutlinedInput
                        id="question"
                        name="question"
                        label={t('Question')}
                        value={formik.values.question}
                        onChange={formik.handleChange}
                        fullWidth
                        multiline
                        sx={{ marginTop: 1 }}
                    />
                    {formik.touched.question && formik.errors.question && (
                        <FormHelperText error id="standard-weight-helper-text-question">
                            {t(formik.errors.question)}
                        </FormHelperText>
                    )}
                </FormControl>

                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <AnimateButton>
                        <Button
                            disabled={isSubmitting ? true : false}
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ minWidth: 120, py: 1, px: 4, my: 2 }}
                        >
                            {isSubmitting ? <CircularProgress size={22} sx={{ color: theme.palette.background.default }} /> : t('Done')}
                        </Button>
                    </AnimateButton>

                    <Button variant="text" color="primary" sx={{ py: 1, px: 4, my: 2, mx: 4 }} onClick={handleClose}>
                        {t('Cancel')}
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

CreateQuestion.propTypes = {
    isSubmitting: PropTypes.bool,
    handleSubmission: PropTypes.func,
    handleClose: PropTypes.func
};
export default CreateQuestion;
