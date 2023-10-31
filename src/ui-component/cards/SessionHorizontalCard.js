import * as React from 'react';
import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import office from 'assets/images/department.jpg';
import PropTypes from 'prop-types';
import { Grid, Box, useTheme, useMediaQuery } from '@mui/material';
import { IconClockPlay, IconClockStop, IconMapPin, IconUsers } from '@tabler/icons';

const SessionHorizontalCard = forwardRef(({ sx = {}, title, address, startdate, enddate, capacity, ...others }, ref) => {
    const theme = useTheme();
    const belowmd = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Card
            ref={ref}
            sx={{
                border: '1px solid',
                borderColor: theme.palette.secondary.light,
                ':hover': {
                    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                },
                ...sx
            }}
            {...others}
        >
            <Grid container sx={{ display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <CardMedia sx={{ width: '100%', height: 200 }} image={office} title="Training Sessions" />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={8}
                    lg={9}
                    xl={9}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingY: 1.2
                    }}
                >
                    <Grid container>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={8}
                            xl={8}
                            sx={{ borderRightWidth: 4, borderColor: theme.palette.primary.main }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'row', paddingX: 2 }}>
                                <Typography variant="subtitle2">Round 12</Typography>
                                <Typography variant="subtitle2" sx={{ marginX: 1 }}>
                                    |
                                </Typography>
                                <Typography variant="subtitle2">Personal Development</Typography>
                            </Box>
                            <Typography variant="h2" sx={{ paddingX: 2, marginY: 1 }}>
                                Personal Development Artifacts
                            </Typography>
                            <Typography variant="body2" sx={{ paddingX: 2 }}>
                                You can change the color value to any valid CSS color value, such as a color nam In this example, we have an
                                icon container
                            </Typography>

                            <Box
                                sx={{
                                    paddingX: 2,
                                    display: 'flex',
                                    flexDirection: belowmd ? 'column' : 'row',
                                    marginY: 1
                                }}
                            >
                                {capacity && (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 1 }}>
                                        <IconUsers size={18} />
                                        <Box sx={{ paddingX: 2 }}>
                                            <Typography variant="subtitle1">{capacity} Trainee </Typography>
                                            <Typography variant="subtitle2">Maximum Capacity </Typography>
                                        </Box>
                                    </Box>
                                )}

                                {address && (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 1 }}>
                                        <IconMapPin size={18} />
                                        <Box sx={{ paddingX: 2 }}>
                                            <Typography variant="subtitle1">{address} </Typography>
                                            <Typography variant="subtitle2">Training address </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: belowmd ? 'row' : 'column',
                                    alignItems: 'flex-start',
                                    paddingBottom: 2,
                                    marginTop: 1,
                                    paddingX: 2
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconClockPlay size={18} />
                                    <Box marginLeft={2}>
                                        <Typography variant="subtitle2">From </Typography>
                                        <Typography variant="subtitle1">{startdate}</Typography>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: belowmd ? 2 : 0
                                    }}
                                >
                                    <IconClockStop size={18} />
                                    <Box marginLeft={2}>
                                        <Typography variant="subtitle2">To </Typography>
                                        <Typography variant="subtitle1">{enddate}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
});

SessionHorizontalCard.propTypes = {
    sx: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

export default SessionHorizontalCard;
