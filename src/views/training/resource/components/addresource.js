// material-ui
import {
    Grid,
    Button,
    useTheme,
    CircularProgress,
    TextField,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormHelperText,
    Typography
} from '@mui/material';

// project imports
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

// ==============================|| ADD RESOURCE COMPONENT ||============================== //

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Resource name is required').max(255),
    quantity: Yup.string().max(255)
});

const AddResource = ({ handleSubmittion, isSubmitting }) => {
    const theme = useTheme();

    const handleSubmitting = (values) => {
        // Handle form submission here
        handleSubmittion(values);
    };

    const formik = useFormik({
        initialValues: { availability: true, name: '', quantity: '' },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmitting(values);
        }
    });

    return (
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: 2.4,
                marginTop: 1,
                borderRadius: 2,
                border: '2px solid',
                background: theme.palette.primary[200],
                borderColor: theme.palette.primary.light
            }}
        >
            <Typography variant="subtitle1" color="primary" marginLeft={1.4}>
                Add resources
            </Typography>
            <form noValidate onSubmit={formik.handleSubmit}>
                <Grid item xs={12}>
                    <FormControl
                        error={formik.touched.provided && Boolean(formik.errors.provided)}
                        sx={{ marginLeft: 1.4, marginBottom: 2 }}
                    >
                        <RadioGroup
                            aria-labelledby="availability"
                            name="availability"
                            value={formik.values.availability}
                            onChange={formik.handleChange}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-around'
                            }}
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Provided" />
                            <FormControlLabel value={false} control={<Radio />} label="Not Provided" />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <TextField
                            id="resource-name"
                            name="name"
                            label="Resource name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            fullWidth
                            error={formik.touched.name && Boolean(formik.errors.name)}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <FormHelperText error id="standard-weight-helper-text-name">
                                {formik.errors.name}
                            </FormHelperText>
                        )}
                    </Grid>

                    {JSON.parse(formik.values.availability) && (
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} sx={{ transition: 'all 0.8s ease-in-out' }}>
                            <TextField
                                variant="outlined"
                                id="quantity"
                                name="quantity"
                                label="Quantity"
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                            />
                            {formik.touched.quantity && formik.errors.quantity && (
                                <FormHelperText error id="standard-weight-helper-text-name">
                                    {formik.errors.quantity}
                                </FormHelperText>
                            )}
                        </Grid>
                    )}

                    <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                        <Button
                            disabled={isSubmitting ? true : false}
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ py: 1.4 }}
                            fullWidth
                        >
                            {isSubmitting ? <CircularProgress size={22} sx={{ color: theme.palette.background.default }} /> : 'Submit'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    );
};

AddResource.propTypes = {
    handleSubmittion: PropTypes.func,
    isSubmitting: PropTypes.bool
};

export default AddResource;
