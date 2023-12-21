import * as React from 'react';
import { forwardRef } from 'react';
import { Box, Divider, Stack, useTheme } from '@mui/material';
import { IconClockPlay, IconClockStop, IconMapPin, IconUsers } from '@tabler/icons';
import { FormatStatus, ReadMore } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import SessionDetailSkel from './Skeleton/SessionDetailsSkel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

const letterConfig = {
    startfrom: 0,
    endat: 180
};

const SessionDetailCard = forwardRef(
    ({ sx = {}, isLoading, status, title, startdate, enddate, address, capacity, description, resources, children, ...others }, ref) => {
        const { t } = useTranslation();
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
                            minWidth: 380,
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
                                        {t(status)}
                                    </Typography>
                                </Stack>
                            )}

                            <Typography gutterBottom variant="h3" component="div" paddingY={1}>
                                {t(title)}
                            </Typography>
                            <Divider />

                            {startdate && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconClockPlay size={20} />
                                    <Box sx={{ paddingX: 2 }}>
                                        <Typography variant="subtitle1">{startdate}</Typography>
                                        <Typography variant="subtitle2">{t('Start date & time')} </Typography>
                                    </Box>
                                </Box>
                            )}

                            {enddate && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconClockStop size={20} />
                                    <Box sx={{ paddingX: 2 }}>
                                        <Typography variant="subtitle1">{enddate}</Typography>
                                        <Typography variant="subtitle2">{t('End date & time')} </Typography>
                                    </Box>
                                </Box>
                            )}
                            {capacity && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconUsers size={20} />
                                    <Box sx={{ paddingX: 2 }}>
                                        <Typography variant="subtitle1">
                                            {capacity} {t('Trainee')}{' '}
                                        </Typography>
                                        <Typography variant="subtitle2">{t('Maximum Capacity')} </Typography>
                                    </Box>
                                </Box>
                            )}

                            {address && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                                    <IconMapPin size={20} />
                                    <Box sx={{ paddingX: 2 }}>
                                        <Typography variant="subtitle1">{address} </Typography>
                                        <Typography variant="subtitle2">{t('Training address')} </Typography>
                                    </Box>
                                </Box>
                            )}

                            {description && (
                                <Box sx={{ display: 'flex', flexDirection: 'row', marginY: 2.6 }}>
                                    <Box>
                                        <Typography variant="subtitle1">{t('About session')}</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="body2">
                                                {t(ReadMore(description, letterConfig.startfrom, letterConfig.endat, collapse))}
                                            </Typography>

                                            {description.length > letterConfig.endat && (
                                                <Typography
                                                    component={'div'}
                                                    onClick={() => ExpndText()}
                                                    sx={{ marginTop: 1, color: theme.palette.primary.main, cursor: 'pointer' }}
                                                >
                                                    {collapse ? t('Read More') : t('Read Less')}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {children}
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
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    startdate: PropTypes.string,
    enddate: PropTypes.string,
    address: PropTypes.string,
    capacity: PropTypes.number,
    resources: PropTypes.array,
    children: PropTypes.node
};

export default SessionDetailCard;
