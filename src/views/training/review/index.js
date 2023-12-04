import React, { useState } from 'react';
import { Grid, Typography, useTheme, Rating, Pagination, CircularProgress, MenuItem, ListItemIcon } from '@mui/material';
import { Box } from '@mui/system';
import RatingProgressBarList from './components/RatingProgressBarList ';
import ReviewsListing from './components/ReviewsList';
import AddRating from './components/addrating';
import Connections from 'api';
import { useQuery } from 'react-query';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { formatDateOnly } from 'utils/functions';
import PropTypes from 'prop-types';
import { ActionMenu } from 'ui-component/menu/action';
import { IconTrash } from '@tabler/icons';

const Review = ({ session_id }) => {
    const theme = useTheme();
    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    const [loading, setLoading] = useState(false);
    const [rated, setRated] = useState(false);
    const [thereview, setTheReview] = useState([]);

    const [lastPage, setLastPage] = useState(1);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 15,
        page: 1
    });

    const [reviews, setReviews] = useState([]);
    const [totalreviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingStat, setReatingStat] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchReviews();
        } else {
            FetchReviews();
        }
    };

    const FetchReviews = async () => {
        var user_id = ActiveUser.user.id;

        setLoading(true);
        var Api =
            Connections.api +
            Connections.sessionreview +
            session_id +
            `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&uid=${user_id}`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const data = parsed.data;
            setRated(data.rated);
            setTheReview(data.thereview);
            setReviews(data.review_data.data);
            setLastPage(data.review_data.last_page);
            setTotalReviews(data.total_reviews);
            setAverageRating(data.average_rating);
            setReatingStat(data.rating_stat);
            setLoading(false);
        }
    };

    useQuery(['data', paginationModel], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    //submit rating
    const handleReviewing = (rating, values) => {
        // Handle form submission here
        setIsSubmitting(true);
        const Api = Connections.api + Connections.traineereview;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        const rated_by = ActiveUser.user.id;

        const data = {
            session_id: session_id,
            user_id: rated_by,
            rating: rating,
            review: values.review
        };

        fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setIsSubmitting(false);
                    handlePrompts(response.message, 'success');
                    FetchReviews();
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

    //the following function handles deleting trinee review
    const handleDeleting = () => {
        var Api = Connections.api + Connections.traineereview + '/' + thereview.id;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        fetch(Api, {
            method: 'DELETE',
            headers: headers
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    handlePrompts(response.message, 'success');
                    FetchReviews();
                } else {
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                handlePrompts(error.message, 'error');
            });
    };

    //handle pagination from here
    const handleChange = (event, value) => {
        setPaginationModel({
            ...paginationModel,
            page: value
        });
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    return (
        <React.Fragment>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 6 }}>
                    <CircularProgress size={22} />
                </Box>
            ) : (
                <Grid container>
                    <Grid item xs={12}>
                        {totalreviews > 0 && (
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
                                    <Typography variant="h1">{parseFloat(averageRating).toFixed(1)}</Typography>
                                    <Box sx={{ marginY: 0.5 }}>
                                        <Rating name="trainee review" value={averageRating} readOnly sx={{ marginY: 1 }} />
                                        <Typography variant="body2" marginLeft={0.5}>
                                            {totalreviews} reviews
                                        </Typography>
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
                                    <RatingProgressBarList ratingCounts={ratingStat} totalCount={totalreviews} />
                                </Grid>
                            </Grid>
                        )}

                        {role === 'Trainee' &&
                            (rated ? (
                                <Box
                                    sx={{
                                        backgroundColor: theme.palette.primary[200],
                                        marginX: 2,
                                        marginTop: 2,
                                        paddingX: 2,
                                        paddingY: 1,
                                        borderLeft: 4,
                                        borderColor: theme.palette.secondary.main,
                                        borderRadius: 2
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography variant="subtitle1">Your review</Typography>
                                        <ActionMenu>
                                            <MenuItem onClick={() => handleDeleting()}>
                                                <ListItemIcon>
                                                    <IconTrash size={18} />
                                                </ListItemIcon>
                                                Delete
                                            </MenuItem>
                                        </ActionMenu>
                                    </Box>
                                    <ReviewsListing
                                        name={thereview.name}
                                        rating={thereview.rating}
                                        description={thereview.review}
                                        date={formatDateOnly(thereview.updated_at)}
                                    />
                                </Box>
                            ) : (
                                <AddRating handleSubmittion={handleReviewing} isSubmitting={isSubmitting} />
                            ))}

                        <Grid container>
                            <Grid item xs={12} sx={{ minHeight: 300, padding: 3, paddingX: 4 }}>
                                {reviews.map((review) => (
                                    <ReviewsListing
                                        key={review.id}
                                        name={review.name}
                                        rating={review.rating}
                                        description={review.review}
                                        date={formatDateOnly(review.updated_at)}
                                    />
                                ))}

                                {reviews.length > paginationModel.pageSize && (
                                    <Box sx={{ paddingY: 4 }}>
                                        <Pagination
                                            showFirstButton
                                            showLastButton
                                            count={lastPage}
                                            page={paginationModel.page}
                                            onChange={handleChange}
                                        />
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>

                    <SnackbarProvider maxSnack={3} />
                </Grid>
            )}
        </React.Fragment>
    );
};

Review.propTypes = {
    session_id: PropTypes.number
};
export default Review;
