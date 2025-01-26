import { useState } from 'react';
import { Button, Grid } from '@mui/material';
import Invited from './Invited';
import Rejected from './Rejected';
import Pending from './Pending';
import Connections from 'api';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

const SessionActions = ({ isLoading, session_id, enrollmentstatus, enrolledcount, trainee, trianeeenrollment, reload }) => {
    const [isChanging, setIsChanging] = useState(false);

    //tranee enroll for training here
    const handleEnrollment = () => {
        setIsChanging(true);

        const Api = Connections.api + Connections.traineeenrollments;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        const data = {
            trainee_id: trainee.id,
            session_id: session_id,
            enrollment_type: 'requested',
            enrollment_status: 'pending'
        };

        fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setIsChanging(false);
                    handlePrompts(response.message, 'success');
                    reload(); //after a enrollment succeed reload the training session page
                } else {
                    setIsChanging(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setIsChanging(false);
                handlePrompts(error, 'error');
            });
    };

    //handle trainee enrollment status here
    const handleStatus = (newStatus) => {
        setIsChanging(true);
        const Api = Connections.api + Connections.enrollmentstatus + trianeeenrollment.id;
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
                    handlePrompts(response.message, 'success');
                    setIsChanging(false);
                    reload(); //after a status change succeed reload the training session page
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

    const handlePrompts = (message, variant) => {
        //variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                {enrollmentstatus === 'pending' ? (
                    <Pending enrolledcount={enrolledcount} />
                ) : enrollmentstatus === 'invited' ? (
                    <Invited onAccept={() => handleStatus('accepted')} onDecline={() => handleStatus('rejected')} isChanging={isChanging} />
                ) : enrollmentstatus === 'rejected' ? (
                    <Rejected enrolledcount={enrolledcount} />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 3, marginBottom: 1, padding: 1, paddingX: 8 }}
                        onClick={() => handleEnrollment()}
                        disabled={isLoading}
                    >
                        Enroll
                    </Button>
                )}
            </Grid>

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default SessionActions;
