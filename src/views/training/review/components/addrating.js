import React, { useState } from 'react';
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
                marginTop: 1,
                borderRadius: 2,
                border: '2px solid',
                background: theme.palette.primary[200],
                borderColor: theme.palette.primary.light
            }}
        >
            <Typography variant="subtitle1" paddingLeft={0.5}>
                Rating & Review
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Rating
                    name="rating"
                    size="large"
                    value={rating}
                    onChange={(event, newValue) => {
                        setRating(newValue);
                    }}
                    sx={{ paddingY: 2 }}
                />
                <Box sx={{ ml: 2 }}>{labels[rating]}</Box>
            </Box>

            <form noValidate onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} direction={'column'}>
                    <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                        <TextField
                            id="reviews"
                            name="review"
                            label="Tell us your experience"
                            value={formik.values.review}
                            onChange={formik.handleChange}
                            fullWidth
                            multiline
                            rows={4}
                            error={formik.touched.review && Boolean(formik.errors.review)}
                        />
                        {formik.touched.review && formik.errors.review && (
                            <FormHelperText error id="standard-weight-helper-text-review">
                                {formik.errors.review}
                            </FormHelperText>
                        )}
                    </Grid>

                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <Button
                            disabled={isSubmitting || rating == 0 ? true : false}
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ py: 1, px: 8 }}
                        >
                            {isSubmitting ? <CircularProgress size={22} sx={{ color: theme.palette.background.default }} /> : 'Post'}
                        </Button>
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
