import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalTrainingCard from 'ui-component/cards/Skeleton/SkeletonTotalTrainingCard';

import { IconSchool } from '@tabler/icons';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.light,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

// ===========================|| DASHBOARD DEFAULT - TRAINING CARD ||=========================== //

const TotalTrainingCard = ({ isLoading, value }) => {
    const theme = useTheme();

    return (
        <React.Fragment>
            {isLoading ? (
                <SkeletonTotalTrainingCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,

                                                mt: 1
                                            }}
                                        >
                                            <IconSchool color={theme.palette.secondary.dark} />
                                        </Avatar>
                                    </Grid>

                                    <Grid item>
                                        <Typography
                                            sx={{
                                                fontSize: '2.125rem',
                                                fontWeight: 500,
                                                mx: 2,
                                                mt: 1.75,
                                                mb: 0.75,
                                                color: theme.palette.secondary.dark
                                            }}
                                        >
                                            {value} 87
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item sx={{ my: 1.25 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: theme.palette.grey[600]
                                    }}
                                >
                                    Total Trainings
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </React.Fragment>
    );
};

TotalTrainingCard.propTypes = {
    isLoading: PropTypes.bool,
    value: PropTypes.number
};

export default TotalTrainingCard;
