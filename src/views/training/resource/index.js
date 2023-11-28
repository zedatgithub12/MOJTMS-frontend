import { Grid, CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Connections from 'api';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import ResourceListing from './components/ResourceListing';
import AddResource from './components/addresource';

const TrainingResources = ({ session_id }) => {
    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchResources();
        } else {
            FetchResources();
        }
    };

    const FetchResources = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.sessionresources + session_id;
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
            setResources(data);
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    const handleAdding = (values) => {
        // Handle form submission here
        setIsSubmitting(true);
        const Api = Connections.api + Connections.trainingresources;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        const added_by = ActiveUser.user.id;
        const parsedAvaialblity = JSON.parse(values.availability);

        const data = {
            session_id: session_id,
            name: values.name,
            quantity: values.quantity,
            availability: parsedAvaialblity,
            added_by: added_by
        };

        fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setIsSubmitting(false);
                    handlePrompts(response.message, 'success');
                    FetchResources();
                } else {
                    setIsSubmitting(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                handlePrompts(error, 'error');
            });
    };

    //the following function handles remove resources trainee
    const handleDeleting = (res_id) => {
        setDeleting(true);

        var Api = Connections.api + Connections.trainingresources + '/' + res_id;
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
                    FetchResources();
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
            <Grid item xs={12} padding={1}>
                <AddResource handleSubmittion={handleAdding} isSubmitting={isSubmitting} />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 6 }}>
                        <CircularProgress size={22} />
                    </Box>
                ) : resources.length == 0 ? (
                    <Box paddingY={3} paddingX={1}>
                        <Typography variant="subtitle1">No resource here</Typography>
                        <Typography variant="subtitle2">Add some, and they will be listed here</Typography>
                    </Box>
                ) : (
                    resources.map((item) => (
                        <ResourceListing
                            key={item.id}
                            name={item.name}
                            quantity={item.quantity}
                            availability={item.availability}
                            onRemove={() => handleDeleting(item.id)}
                            removing={deleting}
                        />
                    ))
                )}

                <SnackbarProvider maxSnack={3} />
            </Grid>
        </Grid>
    );
};

TrainingResources.propTypes = {
    session_id: PropTypes.number
};

export default TrainingResources;
