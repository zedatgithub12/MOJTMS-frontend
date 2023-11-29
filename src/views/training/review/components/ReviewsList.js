import { useState } from 'react';
import { Avatar, Grid, Rating, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import { ReadMore } from 'utils/functions';

const letterConfig = {
    startfrom: 0,
    endat: 220
};

const ReviewsListing = ({ data, photo, name, rating, date, description }) => {
    const theme = useTheme();

    const [collapse, setCollapse] = useState(true);

    const ExpndText = () => {
        setCollapse(!collapse);
    };
    return (
        <Grid container>
            <Grid item xs={12} paddingY={2}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingY: 1 }}>
                    <Avatar alt={name} />
                    <Typography variant="h4" marginLeft={2}>
                        {name}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingY: 1 }}>
                    <Rating name="size-small" defaultValue={rating} readOnly size="small" />
                    <Typography variant="subtitle2" marginLeft={1}>
                        Nov, 12, 2023
                    </Typography>
                </Box>

                {description && (
                    <Box sx={{ display: 'flex', flexDirection: 'row', paddingY: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2">
                                {ReadMore(description, letterConfig.startfrom, letterConfig.endat, collapse)}{' '}
                            </Typography>
                            {description.length > letterConfig.endat && (
                                <Typography
                                    component={'div'}
                                    onClick={() => ExpndText()}
                                    sx={{ marginTop: 1, color: theme.palette.primary.main, cursor: 'pointer' }}
                                >
                                    {collapse ? 'Read More' : 'Read Less'}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};

ReviewsListing.propTypes = {
    data: PropTypes.array,
    photo: PropTypes.string,
    name: PropTypes.string,
    rating: PropTypes.number,
    date: PropTypes.string,
    description: PropTypes.string
};

export default ReviewsListing;
