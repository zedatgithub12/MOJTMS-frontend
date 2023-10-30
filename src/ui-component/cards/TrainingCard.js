import * as React from 'react';
import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Grid, Box, useTheme, Stack, Rating } from '@mui/material';
import TrainingCardSkel from './Skeleton/TrainingCardSkel';

const TrainingCard = forwardRef(
    (
        {
            darkTitle,
            secondary,
            sx = {},
            isLoading,
            image,
            title,
            language,
            category,
            departments,
            sessions,
            traineecount,
            rating,
            ratingcount,
            onPress,
            ...others
        },
        ref
    ) => {
        const theme = useTheme();
        return (
            <>
                {isLoading ? (
                    <TrainingCardSkel />
                ) : (
                    <Card
                        ref={ref}
                        sx={{
                            width: 280,
                            border: '1px solid',
                            borderColor: theme.palette.secondary.light,
                            ':hover': {
                                boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                            },
                            ...sx
                        }}
                        {...others}
                    >
                        <CardMedia
                            sx={{
                                width: '100%',
                                height: 160,
                                borderRadius: 1
                            }}
                            image={image}
                            title="Trainer photo"
                        />

                        <Grid item paddingX={1.5}>
                            <Box marginY={1}>
                                <Typography variant="h3"> {title}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                <Typography variant="subtitle1">{language}</Typography>
                                <Typography variant="subtitle1" marginLeft={1}>
                                    {'|'}
                                </Typography>
                                <Typography variant="subtitle1" marginLeft={1}>
                                    {category}
                                </Typography>
                            </Box>

                            <Box paddingY={2} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingX: 1 }}>
                                {departments && (
                                    <Box>
                                        <Typography variant="h3">{departments}</Typography>
                                        <Typography variant="subtitle2">{departments > 0 ? 'Departments' : 'Department'} </Typography>
                                    </Box>
                                )}
                                {sessions && (
                                    <Box>
                                        <Typography variant="h3">{sessions}</Typography>
                                        <Typography variant="subtitle2">{sessions > 0 ? 'Sessions' : 'Session'} </Typography>
                                    </Box>
                                )}
                                {traineecount && (
                                    <Box>
                                        <Typography variant="h3">{traineecount}</Typography>
                                        <Typography variant="subtitle2">{traineecount > 0 ? 'Trainees' : 'Trainee'} </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Stack marginTop={2.4}>
                                {rating ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: 2 }}>
                                        <Typography variant="h4" marginX={1}>
                                            {rating}{' '}
                                        </Typography>
                                        <Rating name="read-only" value={rating} readOnly />
                                        <Typography variant="subtitle">({ratingcount})</Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="subtitle2">No rating yet</Typography>
                                )}
                            </Stack>
                        </Grid>
                    </Card>
                )}
            </>
        );
    }
);

TrainingCard.propTypes = {
    children: PropTypes.node,
    darkTitle: PropTypes.bool,
    secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    sx: PropTypes.object,
    isLoading: PropTypes.bool,
    image: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    language: PropTypes.string,
    category: PropTypes.string,
    departments: PropTypes.number,
    sessions: PropTypes.number,
    rating: PropTypes.number,
    ratingcount: PropTypes.number,
    onPress: PropTypes.func
};

export default TrainingCard;
