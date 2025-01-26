import React, { forwardRef } from 'react';
import { Grid, Box, useTheme, Stack, Rating } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import TrainingCardSkel from './Skeleton/TrainingCardSkel';
import Placeholder from 'assets/images/placeholder.jpg';

const TrainingCard = forwardRef(
    ({ sx = {}, isLoading, image, title, language, category, sessions, traineecount, rating, ratingcount, onPress, ...others }, ref) => {
        const { t } = useTranslation();
        const theme = useTheme();
        return (
            <React.Fragment>
                {isLoading ? (
                    <TrainingCardSkel />
                ) : (
                    <Card
                        onClick={onPress}
                        ref={ref}
                        sx={{
                            width: 280,
                            margin: 1,
                            border: '1px solid',
                            borderColor: theme.palette.secondary.light,
                            ':hover': {
                                boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                            },
                            ...sx
                        }}
                        {...others}
                    >
                        {image ? (
                            <CardMedia
                                sx={{
                                    width: '100%',
                                    height: 160,
                                    borderRadius: 1
                                }}
                                image={image}
                                title={t('Training thumbnail')}
                            />
                        ) : (
                            <CardMedia
                                sx={{
                                    width: '100%',
                                    height: 160,
                                    borderRadius: 1
                                }}
                                image={Placeholder}
                                title={t('Training thumbnail')}
                            />
                        )}

                        <Grid item paddingX={1.5}>
                            <Box marginY={1}>
                                <Typography variant="h3"> {t(title)}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                <Typography variant="subtitle1">{t(language)}</Typography>
                                <Typography variant="subtitle1" marginLeft={1}>
                                    {'|'}
                                </Typography>
                                <Typography variant="subtitle1" marginLeft={1}>
                                    {t(category)}
                                </Typography>
                            </Box>

                            <Box paddingY={2} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingX: 1 }}>
                                {sessions !== 0 && (
                                    <Box>
                                        <Typography variant="h3">{t(sessions)}</Typography>
                                        <Typography variant="subtitle2">{sessions > 0 ? t('Sessions') : t('Session')} </Typography>
                                    </Box>
                                )}
                                {traineecount !== 0 && (
                                    <Box marginLeft={4}>
                                        <Typography variant="h3">{traineecount}</Typography>
                                        <Typography variant="subtitle2">{traineecount > 0 ? t('Trainees') : t('Trainee')} </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Stack marginTop={1.4}>
                                {rating ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: 2 }}>
                                        <Typography variant="h4" marginX={1}>
                                            {parseFloat(rating).toFixed(1)}{' '}
                                        </Typography>
                                        <Rating name="read-only" value={rating} readOnly />
                                        <Typography variant="subtitle">({ratingcount})</Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="subtitle2" marginBottom={1}>
                                        {t('No rating yet')}
                                    </Typography>
                                )}
                            </Stack>
                        </Grid>
                    </Card>
                )}
            </React.Fragment>
        );
    }
);

TrainingCard.propTypes = {
    sx: PropTypes.object,
    isLoading: PropTypes.bool,
    image: PropTypes.string,
    title: PropTypes.string,
    language: PropTypes.string,
    category: PropTypes.string,
    sessions: PropTypes.number,
    traineecount: PropTypes.number,
    rating: PropTypes.number,
    ratingcount: PropTypes.number,
    onPress: PropTypes.func
};

export default TrainingCard;
