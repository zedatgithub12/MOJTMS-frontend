import { CircularProgress, Divider, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Connections from 'api';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import TrainerListing from './components/TrainerListing';
import AssignedListing from './components/AssignedListing';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { IconX } from '@tabler/icons';

const TrainingTrainers = ({ session_id }) => {
    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    const [assigned, setAssigned] = useState([]);
    const [allTrainers, setAllTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState();
    const [loading, setLoading] = useState(false);

    const [assigning, setAssigning] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchTrainers();
        } else {
            FetchTrainers();
        }
    };

    const FetchTrainers = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.trainersofsession + session_id + `?role=${role}`;
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
            const allTrainers = parsed.trainers;
            setAssigned(data);
            setAllTrainers(allTrainers);
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    //handle the work that should be done before the actual assignment operation
    const handleAssignInit = (trainerid) => {
        setSelectedTrainer(trainerid);
        handleAssignement(trainerid);
    };

    //submit the training to be added
    const handleAssignement = (trainer) => {
        setAssigning(true);

        const Api = Connections.api + Connections.trainingtrainers;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        var assigned_by = ActiveUser.user.id;
        const data = {
            trainer_id: trainer,
            session_id: session_id,
            assigned_by: assigned_by
        };

        fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setAssigning(false);
                    handlePrompts(response.message, 'success');

                    FetchTrainers(); //fetch the updated trainer status from database
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
    const handleDeleteInit = (trainerid) => {
        setSelectedTrainer(trainerid);
        handleDeleting(trainerid);
    };
    //the following function handles remove assigned trainer
    const handleDeleting = (trainer) => {
        setDeleting(true);

        var Api = Connections.api + Connections.trainingtrainers + '/' + trainer;
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
                    FetchTrainers();
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
                <Box paddingY={3}>
                    <Typography variant="subtitle1">No trainer assigned to this training yet!</Typography>
                    <Typography variant="subtitle2">After the trainer assignment, they will be listed here</Typography>
                </Box>
            ) : (
                assigned.map((trainer) => (
                    <AssignedListing
                        key={trainer.id}
                        name={trainer.name}
                        education_level={trainer.qualifications}
                        specialisation={trainer.specialisation}
                        status={trainer.training_status}
                        isRemoving={
                            <IconButton onClick={() => handleDeleteInit(trainer.id)}>
                                {trainer.id === selectedTrainer && deleting ? <CircularProgress size={18} /> : <IconX size={20} />}
                            </IconButton>
                        }
                    />
                ))
            )}

            {role === 'Admin' ? (
                <Box>
                    <Divider />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}></Box>
                    ) : allTrainers.length == 0 ? (
                        <Box paddingY={1.4}>
                            <Typography variant="subtitle1">No trainer to be assigned found!</Typography>
                            <Typography variant="subtitle2">Make sure you have trainer in the database and they are active</Typography>
                        </Box>
                    ) : (
                        allTrainers.map((trainer) => (
                            <TrainerListing
                                key={trainer.id}
                                name={trainer.name}
                                education_level={trainer.qualifications}
                                specialisation={trainer.specialisation}
                                status={trainer.status}
                                onAssign={() => handleAssignInit(trainer.id)}
                                isAssigning={
                                    trainer.id === selectedTrainer && assigning ? (
                                        <CircularProgress size={18} sx={{ color: 'white' }} />
                                    ) : (
                                        'Assign'
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
                    ) : allTrainers.length == 0 ? (
                        <Box paddingY={1.4}>
                            <Typography variant="subtitle1">No trainer to be assigned found!</Typography>
                            <Typography variant="subtitle2">Make sure you have trainer in the database and they are active</Typography>
                        </Box>
                    ) : (
                        allTrainers.map((trainer) => (
                            <TrainerListing
                                key={trainer.id}
                                name={trainer.name}
                                education_level={trainer.qualifications}
                                specialisation={trainer.specialisation}
                                status={trainer.status}
                                onAssign={() => handleAssignInit(trainer.id)}
                                isAssigning={
                                    trainer.id === selectedTrainer && assigning ? (
                                        <CircularProgress size={18} sx={{ color: 'white' }} />
                                    ) : (
                                        'Assign'
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

TrainingTrainers.propTypes = {
    session_id: PropTypes.number
};

export default TrainingTrainers;
