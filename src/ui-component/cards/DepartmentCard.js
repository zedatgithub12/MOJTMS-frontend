import * as React from 'react';
import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@mui/material';
import { IconChalkboard, IconMail, IconPhone, IconUsers } from '@tabler/icons';
import DepartmentCardSkel from './Skeleton/DepartmentCard';

const DepartmentCard = forwardRef(
    (
        {
            children,
            content,
            contentClass,
            darkTitle,
            secondary,
            sx = {},
            contentSX = {},
            isLoading,
            image,
            title,
            email,
            phone,
            trainingcount,
            onPress,
            traineecount,
            ...others
        },
        ref
    ) => {
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
                        <CardMedia sx={{ height: 140 }} image={image} title="Departments" />
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

                            <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 4 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconChalkboard size={18} />
                                    <Typography variant="h5" marginLeft={1}>
                                        {trainingcount}
                                    </Typography>
                                </Box>
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
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </>
        );
    }
);

DepartmentCard.propTypes = {
    children: PropTypes.node,
    content: PropTypes.bool,
    contentClass: PropTypes.string,
    darkTitle: PropTypes.bool,
    secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    sx: PropTypes.object,
    contentSX: PropTypes.object,
    isLoading: PropTypes.bool,
    image: PropTypes.string,
    title: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    traineecount: PropTypes.number,
    traineecount: PropTypes.number,
    onPress: PropTypes.func
};

DepartmentCard.defaultProps = {
    content: true
};

export default DepartmentCard;
