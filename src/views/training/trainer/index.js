import { CircularProgress, Divider, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { IconX } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import Connections from 'api';
import PropTypes from 'prop-types';
import TrainerListing from './components/TrainerListing';
import AssignedListing from './components/AssignedListing';
import AddTrainerSurvey from './components/AddTrainerSurvey';

const TrainingTrainers = ({ session_id, canReview }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const userID = user?.user?.id;
    const role = user?.user?.role;

    const [assigned, setAssigned] = useState([]);
    const [allTrainers, setAllTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState();
    const [loading, setLoading] = useState(false);

    const [assigning, setAssigning] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [open, setOpen] = useState(false);

    const handleOpen = (trainerid) => {
        setSelectedTrainer(trainerid);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
        var Api = Connections.api + Connections.trainersofsession + session_id + `?uid=${userID}&role=${role}`;
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

        const data = {
            trainer_id: trainer,
            session_id: session_id,
            assigned_by: userID
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

    //The following function handles remove assigned trainer
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

    //fetch the assigned training from the trainer_surveys table
    const handleFetchingAssignedSurvey = async (surveyid) => {
        const Api = Connections.api + Connections.trainersurveys + '/' + surveyid;
        const token = sessionStorage.getItem('token');

        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(Api, { method: 'GET', headers });
            const data = await response.json();
            if (data.success) {
                return data;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    };

    //handle survey trainer view
    const handleViewSurvey = async (surveyid) => {
        const userString = sessionStorage.getItem('user');
        const user = JSON.parse(userString);
        const role = user?.user?.role;

        const response = await handleFetchingAssignedSurvey(surveyid);

        if (response) {
            switch (role) {
                case 'Admin':
                case 'Coordinator':
                    navigate('/survey/view', { state: { id: response?.data?.survey_id } });
                    break;
                default:
                    navigate('/training/trainer/survey', { state: response?.data });
                    break;
            }
        }
    };

    //The following function handles remove assigned trainer survey
    const handleRemoveSurvey = (surveyid) => {
        let id = parseInt(surveyid);
        var Api = Connections.api + Connections.trainersurveys + '/' + id;
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
                    handlePrompts(response.message, 'success');
                    handleFetching();
                } else {
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                handlePrompts(error.message, 'error');
            });
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(t(message), { variant });
    };

    return (
        <Box padding={1}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 6 }}>
                    <CircularProgress size={22} />
                </Box>
            ) : assigned.length == 0 ? (
                <Box paddingY={3}>
                    <Typography variant="subtitle1">{t('No trainer assigned to this training yet!')}</Typography>
                    <Typography variant="subtitle2">{t('After the trainers assignment, they will be listed here')}</Typography>
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
                                {trainer.id === selectedTrainer && deleting ? <CircularProgress size={18} /> : <IconX size={18} />}
                            </IconButton>
                        }
                        onAddSurvey={() => handleOpen(trainer.trainer_id)}
                        onView={() => handleViewSurvey(trainer.surveyAssigned)}
                        surveyAssigned={trainer.surveyAssigned ? true : false}
                        surveyStatus={trainer.surveyStatus}
                        canReview={canReview}
                        onRemoveSurvey={() => handleRemoveSurvey(trainer.surveyAssigned)}
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
                            <Typography variant="subtitle1">{t('No trainer to be assigned found!')}</Typography>
                            <Typography variant="subtitle2">
                                {t('Make sure you have trainer in the database and they are active')}
                            </Typography>
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
                                        t('Assign')
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
                            <Typography variant="subtitle1">{t('No trainer to be assigned found!')}</Typography>
                            <Typography variant="subtitle2">
                                {t('Make sure you have trainer in the database and they are active')}
                            </Typography>
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
                                        t('Assign')
                                    )
                                }
                            />
                        ))
                    )}
                </Box>
            ) : null}

            {open && (
                <AddTrainerSurvey
                    open={open}
                    handleClose={() => handleClose()}
                    trainer_id={selectedTrainer}
                    session_id={session_id}
                    onRefresh={() => handleFetching()}
                />
            )}
            <SnackbarProvider maxSnack={3} />
        </Box>
    );
};

TrainingTrainers.propTypes = {
    session_id: PropTypes.number,
    canReview: PropTypes.bool
};

export default TrainingTrainers;
