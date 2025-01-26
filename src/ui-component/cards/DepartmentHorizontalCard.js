import { forwardRef } from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Box, Grid, useTheme } from '@mui/material';
import { IconChalkboard, IconMail, IconPhone, IconUsers } from '@tabler/icons';
import DepartmentCardSkel from './Skeleton/DepartmentCard';

const DepartmentHorizontalCard = forwardRef(
    ({ sx, isLoading, title, email, phone, trainingcount, onPress, traineecount, ...others }, ref) => {
        const theme = useTheme();

        return (
            <>
                {isLoading ? (
                    <DepartmentCardSkel />
                ) : (
                    <Grid
                        container
                        spacing={1}
                        onClick={onPress}
                        ref={ref}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 2,
                            border: '1px solid',
                            borderRadius: 2,
                            borderColor: theme.palette.secondary.light,
                            my: 1.6,
                            cursor: 'pointer',
                            ':hover': {
                                boxShadow: '0 2px 4px 0 rgb(32 40 45 / 8%)'
                            },
                            ...sx
                        }}
                        {...others}
                    >
                        <Grid item xs={12} sm={12} md={3}>
                            <Typography variant="h4">{title}</Typography>
                        </Grid>

                        {email && (
                            <Grid item xs={12} sm={12} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconMail size={18} />
                                    <Typography sx={{ marginLeft: 1 }}>{email}</Typography>
                                </Box>
                            </Grid>
                        )}

                        {phone && (
                            <Grid item xs={12} sm={12} md={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconPhone size={18} />
                                    <Typography sx={{ marginLeft: 1 }}>{phone}</Typography>
                                </Box>
                            </Grid>
                        )}

                        {trainingcount && (
                            <Grid item xs={12} sm={12} md={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconChalkboard size={18} />
                                    <Typography variant="h6" marginLeft={1}>
                                        {trainingcount}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}

                        {traineecount && (
                            <Grid item xs={12} sm={12} md={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconUsers size={18} />
                                    <Typography variant="h6" marginLeft={1}>
                                        {traineecount}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                )}
            </>
        );
    }
);

DepartmentHorizontalCard.propTypes = {
    sx: PropTypes.object,
    isLoading: PropTypes.bool,
    title: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    trainingcount: PropTypes.number,
    traineecount: PropTypes.number,
    onPress: PropTypes.func
};

export default DepartmentHorizontalCard;
