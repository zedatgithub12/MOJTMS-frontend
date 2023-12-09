import React, { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Grid, Box, useTheme } from '@mui/material';
import { IconClockPlay, IconClockStop, IconMapPin, IconUsers } from '@tabler/icons';
import TrainingSessionSkel from './Skeleton/TrainingSessionSkel';
import { formatDate } from 'utils/functions';

const TrainingSessionCard = forwardRef(
    ({ sx = {}, isLoading, image, status, title, round, level, address, capacity, startdate, enddate, onPress, ...others }, ref) => {
        const theme = useTheme();

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

        const FormatStatus = (statusInput) => {
            var statusColor;

            switch (statusInput) {
                case 'draft':
                    statusColor = '#808080';
                    break;
                case 'upcoming':
                    statusColor = '#007bff';
                    break;
                case 'scheduled':
                    statusColor = '#656666';
                    break;
                case 'inprogress':
                    statusColor = '#21a300';
                    break;
                case 'cancelled':
                    statusColor = '#c20013';
                    break;
                default:
                    statusColor = '#1a1a1a';
                    break;
            }
            return statusColor;
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
                                title="Training picture"
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
                                            <sup>{FormattedRound(round)}</sup>
                                        </Typography>
                                        <Typography variant="subtitle1">Round</Typography>
                                    </Box>
                                )}
                            </Box>
                        )}

                        <Grid item paddingX={1.5}>
                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                {image && round && (
                                    <Typography variant="subtitle1" color="secondary">
                                        {round}
                                    </Typography>
                                )}
                            </Box>

                            <Box marginY={1}>
                                {status && (
                                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }} color={FormatStatus(status)}>
                                        {status}
                                    </Typography>
                                )}
                                <Typography variant="h3"> {title}</Typography>
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
                                        <Typography variant="subtitle2">From </Typography>
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
                                        <Typography variant="subtitle2">To </Typography>
                                    </Box>
                                </Box>
                            )}

                            {address && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', paddingY: 1.2 }}>
                                    <IconMapPin size={18} />
                                    <Typography sx={{ marginX: 1 }}>{address}</Typography>
                                </Box>
                            )}

                            {capacity && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', paddingY: 1.2 }}>
                                    <IconUsers size={18} />
                                    <Typography sx={{ marginX: 1 }}>{capacity} Trainees</Typography>
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
    level: PropTypes.string,
    address: PropTypes.string,
    capacity: PropTypes.number,
    startdate: PropTypes.string.isRequired,
    enddate: PropTypes.string.isRequired,
    onPress: PropTypes.func
};

export default TrainingSessionCard;
