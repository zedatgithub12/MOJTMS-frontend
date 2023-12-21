import * as React from 'react';
import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@mui/material';
import { IconMail, IconPhone, IconUser } from '@tabler/icons';
import { ReadMore } from 'utils/functions';
import DepartmentDetailsCardSkel from './Skeleton/DepartmentDetailCardSkel';

const letterConfig = {
    startfrom: 0,
    endat: 150
};
const DepartmentDetailCard = forwardRef(({ sx = {}, isLoading, image, title, coordinator, email, phone, bio, onPress, ...others }, ref) => {
    const theme = useTheme();

    const [collapse, setCollapse] = React.useState(true);

    const ExpndText = () => {
        setCollapse(!collapse);
    };

    return (
        <>
            {isLoading ? (
                <DepartmentDetailsCardSkel />
            ) : (
                <Card
                    onClick={onPress}
                    ref={ref}
                    sx={{
                        width: 380,
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
                    <CardMedia sx={{ height: 200 }} image={image} title="Departments" />
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="div">
                            {title}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
                            <Typography variant="subtitle2">Training coordinator</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <IconUser size={18} sx={{ marginRight: 2 }} /> <Typography sx={{ marginX: 1 }}>{coordinator}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                            <Typography variant="subtitle2">Email addres</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <IconMail size={18} /> <Typography sx={{ marginX: 1 }}>{email}</Typography>{' '}
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                            <Typography variant="subtitle2">Phone</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <IconPhone size={18} sx={{ marginRight: 2 }} /> <Typography sx={{ marginX: 1 }}>{phone}</Typography>{' '}
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                            <Typography variant="subtitle2">Bio</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography>{ReadMore(bio, letterConfig.startfrom, letterConfig.endat, collapse)}</Typography>

                                {bio.length > letterConfig.endat && (
                                    <Typography
                                        component={'div'}
                                        onClick={() => ExpndText()}
                                        sx={{ marginTop: 1, color: theme.palette.primary.main }}
                                    >
                                        {collapse ? 'Read More' : 'Read Less'}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </>
    );
});

DepartmentDetailCard.propTypes = {
    sx: PropTypes.object,
    contentSX: PropTypes.object,
    isLoading: PropTypes.bool,
    image: PropTypes.string,
    title: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    trainingcount: PropTypes.number,
    traineecount: PropTypes.number,
    coordinator: PropTypes.string,
    bio: PropTypes.string,
    onPress: PropTypes.func
};

export default DepartmentDetailCard;
