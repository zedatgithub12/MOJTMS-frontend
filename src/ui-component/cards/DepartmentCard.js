import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@mui/material';
import { IconChalkboard, IconMail, IconPhone, IconUsers } from '@tabler/icons';
import DepartmentCardSkel from './Skeleton/DepartmentCard';
import Placeholder from 'assets/images/placeholder.jpg';

const DepartmentCard = forwardRef(({ sx, isLoading, image, title, email, phone, trainingcount, onPress, traineecount, ...others }, ref) => {
    const theme = useTheme();
    return (
        <>
            {isLoading ? (
                <DepartmentCardSkel />
            ) : (
                <Card
                    onClick={onPress}
                    ref={ref}
                    sx={{
                        width: 280,
                        margin: 0.5,
                        border: '1px solid',
                        borderColor: theme.palette.secondary.light,
                        cursor: 'pointer',
                        ':hover': {
                            boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                        },
                        ...sx
                    }}
                    {...others}
                >
                    {image ? (
                        <CardMedia sx={{ height: 140 }} image={image} title="Departments" />
                    ) : (
                        <CardMedia sx={{ height: 140 }} image={Placeholder} title="Department" />
                    )}
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="div">
                            {title}
                        </Typography>
                        {email && (
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                <IconMail size={18} /> <Typography sx={{ marginX: 1 }}>{email}</Typography>
                            </Box>
                        )}

                        {phone && (
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <IconPhone size={18} sx={{ marginRight: 2 }} /> <Typography sx={{ marginX: 1 }}>{phone}</Typography>{' '}
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 3 }}>
                            {trainingcount && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconChalkboard size={18} />
                                    <Typography variant="h5" marginLeft={1}>
                                        {trainingcount}
                                    </Typography>
                                </Box>
                            )}

                            {traineecount && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 2
                                    }}
                                >
                                    <IconUsers size={18} />
                                    <Typography variant="h5" marginLeft={1}>
                                        {traineecount}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </>
    );
});

DepartmentCard.propTypes = {
    sx: PropTypes.object,
    isLoading: PropTypes.bool,
    image: PropTypes.string,
    title: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    trainingcount: PropTypes.number,
    traineecount: PropTypes.number,
    onPress: PropTypes.func
};

export default DepartmentCard;
