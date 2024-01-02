import React, { forwardRef } from 'react';
import { Grid, Box, useTheme } from '@mui/material';
import { IconClockPlay, IconClockStop, IconMapPin, IconUsers } from '@tabler/icons';
import { FormatStatus, formatDate } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import TrainingSessionSkel from './Skeleton/TrainingSessionSkel';

const TrainingSessionCard = forwardRef(
    ({ sx = {}, isLoading, image, status, title, round, address, capacity, startdate, enddate, onPress, ...others }, ref) => {
        const theme = useTheme();
        const { t } = useTranslation();

        //round count formatter
        const FormattedRound = (number) => {
            var count;

            switch (number) {
                case 1:
                    count = 'st';
                    break;
                case 2:
                    count = 'nd';
                    break;
                case 3:
                    count = 'rd';
                    break;
                default:
                    count = 'th';
                    break;
            }
            return count;
        };

        return (
            <React.Fragment>
                {isLoading ? (
                    <TrainingSessionSkel />
                ) : (
                    <Card
                        onClick={onPress}
                        ref={ref}
                        sx={{
                            width: 300,
                            marginX: 1,
                            border: '1px solid',
                            borderColor: theme.palette.primary[200],
                            paddingBottom: 1,
                            cursor: 'pointer',
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
                            <Box
                                sx={{
                                    width: '100%',
                                    minHeight: 160,
                                    backgroundColor: theme.palette.primary[200],
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                {round && (
                                    <Box>
                                        <Typography variant="h1" color="primary">
                                            {round}
                                            <sup>{t(FormattedRound(round))}</sup>
                                        </Typography>
                                        <Typography variant="subtitle1">{t('Round')}</Typography>
                                    </Box>
                                )}
                            </Box>
                        )}

                        <Grid item paddingX={1.5}>
                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                {image && round && (
                                    <Typography variant="subtitle1" color="secondary">
                                        {t(round)}
                                    </Typography>
                                )}
                            </Box>

                            <Box marginY={1}>
                                {status && (
                                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }} color={FormatStatus(status)}>
                                        {t(status)}
                                    </Typography>
                                )}
                                <Typography variant="h3"> {t(title)}</Typography>
                            </Box>

                            {startdate && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        paddingY: 1
                                    }}
                                >
                                    <IconClockPlay size={18} />
                                    <Box sx={{ marginX: 1 }}>
                                        <Typography variant="subtitle1">{formatDate(startdate)}</Typography>
                                        <Typography variant="subtitle2">{t('From')} </Typography>
                                    </Box>
                                </Box>
                            )}

                            {enddate && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        paddingY: 1
                                    }}
                                >
                                    <IconClockStop size={18} />
                                    <Box sx={{ marginX: 1 }}>
                                        <Typography variant="subtitle1">{formatDate(enddate)}</Typography>
                                        <Typography variant="subtitle2">{t('To')} </Typography>
                                    </Box>
                                </Box>
                            )}

                            {address && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', paddingY: 1.2 }}>
                                    <IconMapPin size={18} />
                                    <Typography sx={{ marginX: 1 }}>{t(address)}</Typography>
                                </Box>
                            )}

                            {capacity && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', paddingY: 1.2 }}>
                                    <IconUsers size={18} />
                                    <Typography sx={{ marginX: 1 }}>
                                        {capacity} {t('Trainees')}
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Card>
                )}
            </React.Fragment>
        );
    }
);

TrainingSessionCard.propTypes = {
    sx: PropTypes.object,
    isLoading: PropTypes.bool,
    image: PropTypes.string,
    status: PropTypes.string,
    title: PropTypes.string,
    round: PropTypes.number,
    address: PropTypes.string,
    capacity: PropTypes.number,
    startdate: PropTypes.string.isRequired,
    enddate: PropTypes.string.isRequired,
    onPress: PropTypes.func
};

export default TrainingSessionCard;
