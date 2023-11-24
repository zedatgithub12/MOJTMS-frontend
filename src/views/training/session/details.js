import { useState } from 'react';
import { Grid, Box, Typography, useTheme, MenuItem, ListItemIcon } from '@mui/material';
import { useLocation } from 'react-router';
import { IconEdit } from '@tabler/icons';
import DetailHeader from './components/DetailHeader';
import SessionDetailCard from 'ui-component/cards/SessionDetailCard';
import { formatDate } from 'utils/functions';
import TabOne from './components/Tabone';

const SessionDetails = () => {
    const theme = useTheme();
    const { state } = useLocation();

    const [tab, setTab] = useState(0);
    const [collapse, setCollapse] = useState(true);

    const ExpndText = () => {
        setCollapse(!collapse);
    };

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

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

    return (
        <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid
                item
                xs={11}
                sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: theme.palette.primary[200] + 25,
                    ':hover': {
                        boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                    }
                }}
            >
                <Grid
                    container
                    sx={{
                        minHeight: 240,
                        paddingBottom: 6,
                        background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`,
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6
                    }}
                >
                    <DetailHeader
                        back={true}
                        title={state.title}
                        option={true}
                        optionChildrens={
                            <Box>
                                <MenuItem onClick={() => navigate('/training/update', { state: state })}>
                                    <ListItemIcon>
                                        <IconEdit size={18} />
                                    </ListItemIcon>
                                    Update
                                </MenuItem>
                            </Box>
                        }
                    >
                        <Grid
                            item
                            xs={12}
                            sm={10}
                            md={9}
                            lg={9}
                            xl={9}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                paddingBottom: 2
                            }}
                        >
                            <Box sx={{ marginX: 3, padding: 0.2 }}>
                                {state.training_name ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2 }}>
                                        <Typography variant="subtitle1">{state.training_name} </Typography>{' '}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: 60,
                                                minHeight: 30,
                                                borderRadius: 3,
                                                padding: 1,
                                                backgroundColor: theme.palette.background.default,
                                                marginLeft: 2,
                                                paddingX: 1
                                            }}
                                        >
                                            {state.round_number && (
                                                <Typography variant="h4" color="primary">
                                                    {state.round_number} <sup>{FormattedRound(state.round_number)} </sup> Round
                                                </Typography>
                                            )}{' '}
                                        </Box>
                                    </Box>
                                ) : (
                                    <Typography variant="subtitle1">Training title</Typography>
                                )}

                                {state.round_name ? (
                                    <Typography variant="h3">{state.round_name}</Typography>
                                ) : (
                                    <Typography variant="h4">Session title</Typography>
                                )}
                                {state.round_description && (
                                    <Typography
                                        variant="body2"
                                        marginTop={2}
                                        sx={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                        {state.round_description}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </DetailHeader>
                </Grid>

                <Grid
                    container
                    sx={{
                        justifyContent: 'center'
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={9}
                        lg={9}
                        xl={9}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            paddingBottom: 2
                        }}
                    >
                        <Grid
                            container
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={8.6}
                                lg={8.6}
                                xl={8.6}
                                sx={{
                                    minHeight: 400,
                                    paddingX: 2,
                                    borderRadius: 2,
                                    backgroundColor: theme.palette.background.default,
                                    marginTop: -6
                                }}
                            >
                                {/* tabone for session details */}
                                <TabOne training_id={state.training_id} session_id={state.id} />
                            </Grid>

                            <Grid item xs={12} sm={12} md={3.1} lg={3.1} xl={3.1} sx={{ paddingX: 2, marginTop: -29 }}>
                                <SessionDetailCard
                                    isLoading={false}
                                    status={state.status}
                                    title="Training Details"
                                    startdate={formatDate(state.start_date)}
                                    enddate={formatDate(state.end_date)}
                                    address={state.address}
                                    capacity={state.maximum_capacity}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SessionDetails;
