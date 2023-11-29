import { useState } from 'react';
import { Grid, Typography, useTheme, Rating } from '@mui/material';
import { Box } from '@mui/system';
import RatingProgressBarList from './components/RatingProgressBarList ';
import ReviewsListing from './components/ReviewsList';
import AddRating from './components/addrating';
import Connections from 'api';

const Review = ({ session_id }) => {
    const theme = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ratingCounts = [
        { type: 5, count: 140 },
        { type: 4, count: 30 },
        { type: 3, count: 10 },
        { type: 2, count: 5 },
        { type: 1, count: 15 }
    ];

    const rated = true;

    const handleAdding = (rating, values) => {
        // Handle form submission here
        setIsSubmitting(true);
        const Api = Connections.api + Connections.trainingresources;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        const added_by = ActiveUser.user.id;
        const parsedAvaialblity = JSON.parse(values.availability);

        const data = {
            session_id: session_id,
            name: values.name,
            quantity: values.quantity,
            availability: parsedAvaialblity,
            added_by: added_by
        };

        fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setIsSubmitting(false);
                    handlePrompts(response.message, 'success');
                    FetchResources();
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

    return (
        <Grid container>
            {rated ? (
                <AddRating handleSubmittion={handleAdding} isSubmitting={isSubmitting} />
            ) : (
                <Grid item xs={12}>
                    <Grid container justifyContent={'space-around'} marginTop={2}>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={4}
                            lg={3}
                            xl={3}
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                padding: 2,
                                borderRadius: 4,
                                boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Typography variant="h1">4.5</Typography>
                            <Box sx={{ marginY: 0.5 }}>
                                <Rating name="trainee review" defaultValue={4.6} readOnly sx={{ marginY: 1 }} />
                                <Typography variant="body2">231 reviews</Typography>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={7}
                            lg={8}
                            xl={8}
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                padding: 2,
                                borderRadius: 4,
                                boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                            }}
                        >
                            <RatingProgressBarList ratingCounts={ratingCounts} totalCount={200} />
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={12} sx={{ minHeight: 300, padding: 3, paddingX: 4 }}>
                            <ReviewsListing
                                name="Zerihun Tegenu"
                                rating={3}
                                description="Your new app update is not intuitive and less visually appealing than it was before. I am frustrated that I can't take a multiple choice exam on my app, but can it be on a laptop bc it was designed for a larger screen? You have the ability to make it fit phones as well. You guys pride and sell yourself on being able to learn wherever at your own convenience. Having to relocate to a computer to take a multiple choice test when it could fit on the phone isn't convenient at all."
                            />

                            <ReviewsListing
                                name="Anteneh Tesfaye"
                                rating={5}
                                description="Until recently I have had no problems with the app, however the newest update has caused a large down tick in my productivity. The modules no longer continue automatically, you can no longer take practice exams or assignments on Mobile, and the transcript jumps back to the middle anytime you try to scroll down to the bottom. Please fix this Coursera."
                            />
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

export default Review;
