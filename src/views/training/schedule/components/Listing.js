import { useState } from 'react';
import { CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconArrowRight } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { Delete } from 'ui-component/delete/Delete';
import { convertDateTime } from 'utils/functions';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import PropTypes from 'prop-types';
import ActionButtons from 'ui-component/Buttons/ActionButtons';

const ScheduleListing = ({ isLoading, schedules, updateSchedules }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const scheduleLegth = schedules && schedules.length;

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    const [selectedSchedule, setSelectedSchedule] = useState();
    const [deleteSchedule, setDeleteSchedule] = useState(false);
    const [deleting, setDeleting] = useState(false);

    //initiate schedule deletion
    const handleDeleteInitiation = (itemid) => {
        setSelectedSchedule(itemid);
        setDeleteSchedule(true);
    };

    //the following function handles delete question functionality
    const handleDeleteSchedule = () => {
        setDeleting(true);

        var Api = Connections.api + Connections.schedules + '/' + selectedSchedule;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        fetch(Api, {
            method: 'DELETE',
            headers: headers
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setDeleting(false);
                    setDeleteSchedule(false);
                    handlePrompts(response.message, 'success');

                    // Remove the deleted schedule from the schedules array
                    //and update the state in parent component
                    const updatedSchedules = schedules.filter((schedule) => schedule.id !== selectedSchedule);
                    updateSchedules(updatedSchedules);
                } else {
                    setDeleting(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setDeleting(false);
                handlePrompts(error.message, 'error');
            });
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    return (
        <Grid container>
            <Grid item xs={12} marginY={2} padding={1}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size={22} />
                    </Box>
                ) : scheduleLegth == 0 ? (
                    <Box>
                        <Typography variant="body1">{t('Schedule not added yet!')}</Typography>
                    </Box>
                ) : (
                    schedules.map((item, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: theme.palette.primary[200],
                                            width: 32,
                                            height: 32,
                                            borderRadius: 16
                                        }}
                                    >
                                        <Typography variant="subtitle1" color="primary">
                                            {(index += 1)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ padding: 2 }}>
                                        <Typography variant="subtitle1">{t(item.scheduled_title)}</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography variant="body2">{convertDateTime(item.start_datetime)}</Typography>
                                            <IconArrowRight size={14} style={{ margin: 3 }} />
                                            <Typography variant="body2">{convertDateTime(item.end_datetime)}</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {role === 'Admin' ? (
                                    <ActionButtons
                                        onEdit={() => navigate('/training/schedule/update', { state: item })}
                                        onDelete={() => handleDeleteInitiation(item.id)}
                                    />
                                ) : role === 'Coordinator' ? (
                                    <ActionButtons
                                        onEdit={() => navigate('/training/schedule/update', { state: item })}
                                        onDelete={() => handleDeleteInitiation(item.id)}
                                    />
                                ) : null}
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    marginLeft: 2,
                                    paddingLeft: 4,
                                    paddingY: 0.5,
                                    borderLeft: index === scheduleLegth ? 0 : 0.8,
                                    borderColor: theme.palette.grey[300],
                                    paddingBottom: 3
                                }}
                            >
                                {t(item.schedule_description)}
                            </Typography>
                        </Box>
                    ))
                )}
            </Grid>

            {deleteSchedule && (
                <Delete
                    type="Delete"
                    open={deleteSchedule}
                    title="Deleting scheduled program"
                    description={`Are you sure you want to delete this program`}
                    onNo={() => setDeleteSchedule(false)}
                    onYes={() => handleDeleteSchedule()}
                    deleting={deleting}
                    handleClose={() => setDeleteSchedule(false)}
                />
            )}

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

ScheduleListing.propTypes = {
    isLoading: PropTypes.bool,
    schedules: PropTypes.array,
    updateSchedules: PropTypes.func
};

export default ScheduleListing;
