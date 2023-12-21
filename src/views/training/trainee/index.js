import { CircularProgress, Divider, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { IconThumbDown, IconX } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import PropTypes from 'prop-types';
import TraineeListing from './components/TraineeListing';
import AssignedListing from './components/AssignedListing';

const TraineeEnrollment = ({ session_id }) => {
    const { t } = useTranslation();
    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    const [assigned, setAssigned] = useState([]);
    const [allTrainee, setAllTrainee] = useState([]);
    const [selectedTrainee, setSelectedTrainee] = useState();
    const [loading, setLoading] = useState(false);

    const [assigning, setAssigning] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchTrainees();
        } else {
            FetchTrainees();
        }
    };

    const FetchTrainees = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.sessionenrollments + session_id + `?role=${role}`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const data = parsed.data;
            const allTrainee = parsed.trainees;
            setAssigned(data);
            setAllTrainee(allTrainee);
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    //handle the work that should be done before the actual assignment operation
    const handleAssignInit = (traineeid) => {
        setSelectedTrainee(traineeid);
        handleInvitation(traineeid);
    };

    //submit the training to be added
    const handleInvitation = (traineeid) => {
        setAssigning(true);

        const Api = Connections.api + Connections.traineeenrollments;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        const data = {
            trainee_id: traineeid,
            session_id: session_id,
            enrollment_type: 'invited',
            enrollment_status: 'invited'
        };

        fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setAssigning(false);
                    handlePrompts(response.message, 'success');

                    FetchTrainees(); //fetch the updated trainees from database
                } else {
                    setAssigning(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setAssigning(false);
                handlePrompts(error, 'error');
            });
    };

    //handle the work that should be done before the actual remove operation
    const handleChangeInit = (traineeid, newStatus) => {
        setSelectedTrainee(traineeid);
        handleStatus(traineeid, newStatus);
    };

    // Handle trainee enrollment status here
    const handleStatus = (traineeid, newStatus) => {
        setIsChanging(true);
        const Api = Connections.api + Connections.enrollmentstatus + traineeid;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const formData = new FormData();
        formData.append('newstatus', newStatus);

        fetch(Api, { method: 'POST', headers: headers, body: formData })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setIsChanging(false);
                    handlePrompts(response.message, 'success');
                    FetchTrainees();
                } else {
                    handlePrompts(response.message, 'error');
                    setIsChanging(false);
                }
            })
            .catch((error) => {
                handlePrompts(error, 'error');
                setIsChanging(false);
            });
    };

    //handle the work that should be done before the actual remove operation
    const handleDeleteInit = (traineeid) => {
        setSelectedTrainee(traineeid);
        handleDeleting(traineeid);
    };

    //the following function handles remove assigned trainee
    const handleDeleting = (traineeid) => {
        setDeleting(true);

        var Api = Connections.api + Connections.traineeenrollments + '/' + traineeid;
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
                    handlePrompts(response.message, 'success');
                    FetchTrainees();
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
        <Box padding={1}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 6 }}>
                    <CircularProgress size={22} />
                </Box>
            ) : assigned.length == 0 ? (
                <Box paddingY={3} paddingX={1}>
                    <Typography variant="subtitle1">{t('No trainee assigned to this training yet!')}</Typography>
                    <Typography variant="subtitle2">{t('After the trainees assignment, they will be listed here')}</Typography>
                </Box>
            ) : (
                assigned.map((trainee) => (
                    <AssignedListing
                        key={trainee.id}
                        name={trainee.name}
                        education_level={trainee.dept_name}
                        job_title={trainee.job_title}
                        status={trainee.enrollment_status}
                        onAccept={() => handleChangeInit(trainee.id, 'accepted')}
                        isAccepting={
                            trainee.id === selectedTrainee && isChanging ? (
                                <CircularProgress size={18} sx={{ color: 'white' }} />
                            ) : (
                                t('Accept')
                            )
                        }
                        isRemoving={
                            <Box>
                                {trainee.enrollment_status === 'pending' ? (
                                    <IconButton onClick={() => handleChangeInit(trainee.id, 'rejected')} disabled={isChanging}>
                                        <IconThumbDown size={20} />
                                    </IconButton>
                                ) : (
                                    <IconButton onClick={() => handleDeleteInit(trainee.id)}>
                                        {trainee.id === selectedTrainee && deleting ? <CircularProgress size={18} /> : <IconX size={20} />}
                                    </IconButton>
                                )}
                            </Box>
                        }
                    />
                ))
            )}

            {role === 'Admin' && allTrainee ? (
                <Box>
                    <Divider />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}></Box>
                    ) : allTrainee.length == 0 ? (
                        <Box paddingY={1.4} paddingX={1}>
                            <Typography variant="subtitle1">{t('No trainee to be assigned found!')}</Typography>
                            <Typography variant="subtitle2">
                                {t('Make sure you have trainee in the database and they are active')}
                            </Typography>
                        </Box>
                    ) : (
                        allTrainee.map((trainee) => (
                            <TraineeListing
                                key={trainee.id}
                                name={trainee.name}
                                education_level={trainee.dept_name}
                                job_title={trainee.job_title}
                                status={trainee.enrollment_status}
                                onAssign={() => handleAssignInit(trainee.id)}
                                isAssigning={
                                    trainee.id === selectedTrainee && assigning ? (
                                        <CircularProgress size={18} sx={{ color: 'white' }} />
                                    ) : (
                                        t('Invite')
                                    )
                                }
                            />
                        ))
                    )}
                </Box>
            ) : role === 'Coordinator' ? (
                <Box>
                    <Divider />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}></Box>
                    ) : allTrainee.length == 0 ? (
                        <Box paddingY={1.4} paddingX={1}>
                            <Typography variant="subtitle1">{t('No trainee to be assigned found!')}</Typography>
                            <Typography variant="subtitle2">
                                {t('Make sure you have trainee in the database and they are active')}
                            </Typography>
                        </Box>
                    ) : (
                        allTrainee.map((trainee) => (
                            <TraineeListing
                                key={trainee.id}
                                name={trainee.name}
                                education_level={trainee.dept_name}
                                job_title={trainee.job_title}
                                status={trainee.enrollment_status}
                                onAssign={() => handleAssignInit(trainee.id)}
                                isAssigning={
                                    trainee.id === selectedTrainee && assigning ? (
                                        <CircularProgress size={18} sx={{ color: 'white' }} />
                                    ) : (
                                        t('Invite')
                                    )
                                }
                            />
                        ))
                    )}
                </Box>
            ) : null}

            <SnackbarProvider maxSnack={3} />
        </Box>
    );
};

TraineeEnrollment.propTypes = {
    session_id: PropTypes.number
};

export default TraineeEnrollment;
