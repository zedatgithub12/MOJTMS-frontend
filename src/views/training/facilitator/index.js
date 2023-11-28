import { CircularProgress, Divider, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Connections from 'api';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import FacilitatorListing from './components/FacilitatorListing';
import AssignedListing from './components/AssignedListing';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { IconX } from '@tabler/icons';

const TrainingFacilitators = ({ session_id }) => {
    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));

    const [assigned, setAssigned] = useState([]);
    const [allFacailitators, setAllFacilitators] = useState([]);
    const [selectedFacilitator, setSelectedFacilitator] = useState();
    const [loading, setLoading] = useState(false);

    const [assigning, setAssigning] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchFacilitators();
        } else {
            FetchFacilitators();
        }
    };

    const FetchFacilitators = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.sessionfacilitators + session_id;
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
            const allFacailitators = parsed.facilitators;
            setAssigned(data);
            setAllFacilitators(allFacailitators);
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    //handle the work that should be done before the actual assignment operation
    const handleAssignInit = (fac_id) => {
        setSelectedFacilitator(fac_id);
        handleInvitation(fac_id);
    };

    //submit the training to be added
    const handleInvitation = (fac_id) => {
        setAssigning(true);

        const Api = Connections.api + Connections.trainingfacilitators;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        const data = {
            session_id: session_id,
            user_id: fac_id,
            assigned_by: ActiveUser.user.id
        };

        fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setAssigning(false);
                    handlePrompts(response.message, 'success');

                    FetchFacilitators(); //fetch the updated trainees from database
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
    const handleDeleteInit = (fac_id) => {
        setSelectedFacilitator(fac_id);
        handleDeleting(fac_id);
    };

    //the following function handles remove assigned trainee
    const handleDeleting = (fac_id) => {
        setDeleting(true);

        var Api = Connections.api + Connections.trainingfacilitators + '/' + fac_id;
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
                    FetchFacilitators();
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
                    <Typography variant="subtitle1">Facilitator is not assigned to this training yet!</Typography>
                    <Typography variant="subtitle2">After the facilitators assigned, they will be listed here</Typography>
                </Box>
            ) : (
                assigned.map((fac) => (
                    <AssignedListing
                        key={fac.id}
                        name={fac.name}
                        email={fac.email}
                        status={fac.status}
                        isRemoving={
                            <IconButton onClick={() => handleDeleteInit(fac.id)}>
                                {fac.id === selectedFacilitator && deleting ? <CircularProgress size={18} /> : <IconX size={20} />}
                            </IconButton>
                        }
                    />
                ))
            )}

            {allFacailitators && (
                <Box>
                    <Divider />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}></Box>
                    ) : allFacailitators.length == 0 ? (
                        <Box paddingY={1.4} paddingX={1}>
                            <Typography variant="subtitle1">No facilitator to be assigned found!</Typography>
                            <Typography variant="subtitle2">Make sure you have active facilitator </Typography>
                        </Box>
                    ) : (
                        allFacailitators.map((fac) => (
                            <FacilitatorListing
                                key={fac.id}
                                name={fac.name}
                                email={fac.email}
                                status={fac.status}
                                onAssign={() => handleAssignInit(fac.id)}
                                isAssigning={
                                    fac.id === selectedFacilitator && assigning ? (
                                        <CircularProgress size={18} sx={{ color: 'white' }} />
                                    ) : (
                                        'Assign'
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

TrainingFacilitators.propTypes = {
    session_id: PropTypes.number
};

export default TrainingFacilitators;
