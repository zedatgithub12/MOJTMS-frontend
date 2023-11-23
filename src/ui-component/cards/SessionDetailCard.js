import * as React from 'react';
import { forwardRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Box, Divider, Stack, useTheme } from '@mui/material';
import { IconCircleCheck, IconCircleX, IconClockPlay, IconClockStop, IconMapPin, IconUsers } from '@tabler/icons';
import { FormatStatus, ReadMore } from 'utils/functions';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import SessionDetailSkel from './Skeleton/SessionDetailsSkel';

const letterConfig = {
    startfrom: 0,
    endat: 180
};

const SessionDetailCard = forwardRef(
    (
        { sx = {}, isLoading, status, title, startdate, starttime, enddate, endtime, address, capacity, resources, description, ...others },
        ref
    ) => {
        const theme = useTheme();

        const [collapse, setCollapse] = React.useState(true);
        const [showResources, setShowResources] = React.useState(false);

        const ExpndText = () => {
            setCollapse(!collapse);
        };
        return (
            <React.Fragment>
                {isLoading ? (
                    <SessionDetailSkel />
                ) : (
                    <Card
                        ref={ref}
                        sx={{
                            width: 380,
                            border: '1px solid',
                            borderColor: theme.palette.secondary.light,
                            ':hover': {
                                boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                            },
                            ...sx
                        }}
                        {...others}
                    >
                        <CardContent>
                            {status && (
                                <Stack>
                                    <Typography variant="subtitle1" color={FormatStatus(status)} sx={{ textTransform: 'capitalize' }}>
                                        {status}
                                    </Typography>
                                </Stack>
                            )}

                            <Typography gutterBottom variant="h3" component="div" paddingY={1}>
                                {title}
                            </Typography>
                            <Divider />

                            {startdate && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconClockPlay size={20} />
                                    <Box sx={{ paddingX: 2 }}>
                                        <Typography variant="subtitle1">{startdate}</Typography>
                                        <Typography variant="subtitle2">Start date & time </Typography>
                                    </Box>
                                </Box>
                            )}

                            {enddate && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconClockStop size={20} />
                                    <Box sx={{ paddingX: 2 }}>
                                        <Typography variant="subtitle1">{enddate}</Typography>
                                        <Typography variant="subtitle2">End date & time </Typography>
                                    </Box>
                                </Box>
                            )}
                            {capacity && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconUsers size={20} />
                                    <Box sx={{ paddingX: 2 }}>
                                        <Typography variant="subtitle1">{capacity} Trainee </Typography>
                                        <Typography variant="subtitle2">Maximum Capacity </Typography>
                                    </Box>
                                </Box>
                            )}

                            {address && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconMapPin size={20} />
                                    <Box sx={{ paddingX: 2 }}>
                                        <Typography variant="subtitle1">{address} </Typography>
                                        <Typography variant="subtitle2">Training address </Typography>
                                    </Box>
                                </Box>
                            )}

                            {description && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', marginY: 2.6 }}>
                                    <Box>
                                        <Typography variant="subtitle1">About</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="body2">
                                                {ReadMore(description, letterConfig.startfrom, letterConfig.endat, collapse)}
                                            </Typography>

                                            {description.length > letterConfig.endat && (
                                                <Typography
                                                    component={'div'}
                                                    onClick={() => ExpndText()}
                                                    sx={{ marginTop: 1, color: theme.palette.primary.main, cursor: 'pointer' }}
                                                >
                                                    {collapse ? 'Read More' : 'Read Less'}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                            {resources && (
                                <Box>
                                    <Divider />
                                    <Button
                                        variant="text"
                                        color="primary"
                                        sx={{ marginTop: 1, cursor: 'pointer' }}
                                        onClick={() => setShowResources(!showResources)}
                                    >
                                        Resources provided{' '}
                                        {showResources ? (
                                            <KeyboardArrowUpOutlinedIcon size={20} />
                                        ) : (
                                            <KeyboardArrowDownOutlinedIcon size={20} />
                                        )}
                                    </Button>
                                </Box>
                            )}

                            {showResources && (
                                <Box marginLeft={1} marginY={1}>
                                    {resources.map((resource, index) => (
                                        <Box sx={{ display: 'flex', flexDirection: 'row', marginY: 2.6, alignItems: 'center' }}>
                                            {resource.status ? (
                                                <IconCircleCheck size={16} color="#109e00" />
                                            ) : (
                                                <IconCircleX size={16} color={theme.palette.grey[500]} />
                                            )}
                                            <Typography key={index} variant="body2" marginLeft={1}>
                                                {resource.resource}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}
            </React.Fragment>
        );
    }
);

SessionDetailCard.propTypes = {
    sx: PropTypes.object,
    isLoading: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    description: PropTypes.string,
    status: PropTypes.string,
    startdate: PropTypes.string,
    starttime: PropTypes.string,
    enddate: PropTypes.string,
    endtime: PropTypes.string,
    address: PropTypes.string,
    capacity: PropTypes.number,
    resources: PropTypes.array
};

export default SessionDetailCard;
