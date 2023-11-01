import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Grid, Box, useTheme } from '@mui/material';
import { IconClockPlay, IconClockStop, IconMapPin, IconUsers } from '@tabler/icons';
import TrainingSessionSkel from './Skeleton/TrainingSessionSkel';

const TrainingSessionCard = forwardRef(
    ({ sx = {}, isLoading, image, title, round, level, address, capacity, startdate, enddate, onPress, ...others }, ref) => {
        const theme = useTheme();
        return (
            <>
                {isLoading ? (
                    <TrainingSessionSkel />
                ) : (
                    <Card
                        onClick={onPress}
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
                            title="Training picture"
                        />

                        <Grid item paddingX={1.5}>
                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                {round && (
                                    <Typography variant="subtitle1" color="secondary">
                                        {round}
                                    </Typography>
                                )}

                                {level && (
                                    <>
                                        {' '}
                                        <Typography variant="subtitle1" marginLeft={1} color="grey">
                                            {'|'}
                                        </Typography>
                                        <Typography variant="subtitle1" marginLeft={1} color="secondary">
                                            {level} level
                                        </Typography>
                                    </>
                                )}
                            </Box>

                            <Box marginY={1}>
                                <Typography variant="h3"> {title}</Typography>
                            </Box>

                            {capacity && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', paddingY: 1 }}>
                                    <IconUsers size={18} />
                                    <Typography sx={{ marginX: 1 }}>{capacity}</Typography>
                                </Box>
                            )}

                            {address && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', paddingY: 1.2 }}>
                                    <IconMapPin size={18} />
                                    <Typography sx={{ marginX: 1 }}>{address}</Typography>
                                </Box>
                            )}

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingBottom: 2,
                                    paddingRight: 1,
                                    marginTop: 1
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconClockPlay size={18} />
                                    <Box marginLeft={2}>
                                        <Typography variant="subtitle2">From </Typography>
                                        <Typography variant="h4">{startdate}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconClockStop size={18} />
                                    <Box marginLeft={2}>
                                        <Typography variant="subtitle2">To </Typography>
                                        <Typography variant="h4">{enddate}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Card>
                )}
            </>
        );
    }
);

TrainingSessionCard.propTypes = {
    sx: PropTypes.object,
    isLoading: PropTypes.bool,
    image: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    round: PropTypes.string,
    level: PropTypes.string,
    address: PropTypes.string,
    capacity: PropTypes.string,
    startdate: PropTypes.string.isRequired,
    enddate: PropTypes.string.isRequired,
    onPress: PropTypes.func
};

export default TrainingSessionCard;
