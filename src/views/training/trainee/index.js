import { CircularProgress, Divider, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Connections from 'api';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import TraineeListing from './components/TrainerListing';
import AssignedListing from './components/AssignedListing';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { IconX } from '@tabler/icons';

const TraineeEnrollment = ({ session_id }) => {
    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    const [assigned, setAssigned] = useState([]);
    const [allTrainee, setAllTrainee] = useState([]);
    const [selectedTrainee, setSelectedTrainee] = useState();
    const [loading, setLoading] = useState(false);

    const [assigning, setAssigning] = useState(false);
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
            enrollment_type: 'invited'
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
                    <Typography variant="subtitle1">No trainee assigned to this training yet!</Typography>
                    <Typography variant="subtitle2">After the trainees assignment, they will be listed here</Typography>
                </Box>
            ) : (
                assigned.map((trainee) => (
                    <AssignedListing
                        key={trainee.id}
                        name={trainee.name}
                        education_level={trainee.dept_name}
                        job_title={trainee.job_title}
                        status={trainee.enrollment_status}
                        isRemoving={
                            <IconButton onClick={() => handleDeleteInit(trainee.id)}>
                                {trainee.id === selectedTrainee && deleting ? <CircularProgress size={18} /> : <IconX size={20} />}
                            </IconButton>
                        }
                    />
                ))
            )}

            {allTrainee && (
                <Box>
                    <Divider />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}></Box>
                    ) : allTrainee.length == 0 ? (
                        <Box paddingY={1.4} paddingX={1}>
                            <Typography variant="subtitle1">No trainee to be assigned found!</Typography>
                            <Typography variant="subtitle2">Make sure you have trainee in the database and they are active</Typography>
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
                                        'Invite'
                                    )
                                }
                            />
                        ))
                    )}
                </Box>
            )}

            <SnackbarProvider maxSnack={3} />
        </Box>
    );
};

TraineeEnrollment.propTypes = {
    session_id: PropTypes.number
};

export default TraineeEnrollment;
