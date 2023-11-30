import { useState } from 'react';
// material-ui
import { Grid, Button, useTheme, CircularProgress, TextField, FormHelperText, Typography, Rating } from '@mui/material';

// project imports
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';

// ==============================|| ADD RATING COMPONENT ||============================== //

const validationSchema = Yup.object().shape({});

const labels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very good',
    5: 'Excellent'
};

const AddRating = ({ handleSubmittion, isSubmitting }) => {
    const theme = useTheme();

    const [rating, setRating] = useState(0);

    const handleSubmitting = (values) => {
        // Handle rating submission here
        if (rating > 0) {
            handleSubmittion(rating, values);
        }
    };

    const formik = useFormik({
        initialValues: { review: '' },
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
                marginTop: 2,
                marginX: 1.2,

                backgroundColor: theme.palette.background.default,
                boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)',
                border: '1px solid',
                borderRadius: 2,
                borderColor: theme.palette.primary[200]
            }}
        >
            <form noValidate onSubmit={formik.handleSubmit}>
                <Grid item xs={10} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="subtitle1" color="primary" paddingLeft={0.5}>
                            Add your reviews
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: 1
                            }}
                        >
                            <Rating
                                name="rating"
                                value={rating}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                                sx={{ paddingY: 1 }}
                            />
                            {rating > 0 && <Box sx={{ ml: 1 }}>{labels[rating]}</Box>}
                        </Box>
                    </Box>

                    <Button disabled={isSubmitting || rating == 0 ? true : false} type="submit" variant="contained" color="primary">
                        {isSubmitting ? <CircularProgress size={20} sx={{ color: theme.palette.background.default }} /> : 'Submit'}
                    </Button>
                </Grid>

                <Grid container spacing={2} direction={'column'}>
                    <Grid item xs={12}>
                        <TextField
                            id="reviews"
                            name="review"
                            label="Tell us your experience (optional)"
                            value={formik.values.review}
                            onChange={formik.handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            error={formik.touched.review && Boolean(formik.errors.review)}
                        />
                        {formik.touched.review && formik.errors.review && (
                            <FormHelperText error id="standard-weight-helper-text-review">
                                {formik.errors.review}
                            </FormHelperText>
                        )}
                    </Grid>
                </Grid>
            </form>
        </Grid>
    );
};

AddRating.propTypes = {
    handleSubmittion: PropTypes.func,
    isSubmitting: PropTypes.bool
};

export default AddRating;
