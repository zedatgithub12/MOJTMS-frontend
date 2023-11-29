import { Button, Grid } from '@mui/material';
import Connections from 'api';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ScheduleListing from './components/Listing';
import { useNavigate } from 'react-router';

const TrainingSchedule = ({ session_id }) => {
    const navigate = useNavigate();

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            setRefreshed(true);
            FetchSchedules();
        } else {
            FetchSchedules();
        }
    };

    const FetchSchedules = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.roundschedule + session_id;
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
            setSchedule(data);
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    // Function to update the schedules array
    const updateSchedules = (updatedSchedules) => {
        setSchedule(updatedSchedules);
    };

    return (
        <Grid container>
            <Grid item xs={10}>
                {role === 'Admin' ? (
                    <Button
                        variant="text"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={() => navigate('/training/schedule/create', { state: session_id })}
                    >
                        Add new schedule
                    </Button>
                ) : role === 'Coordinator' ? (
                    <Button
                        variant="text"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={() => navigate('/training/schedule/create', { state: session_id })}
                    >
                        Add new schedule
                    </Button>
                ) : null}

                {schedule && <ScheduleListing isLoading={loading} schedules={schedule} updateSchedules={updateSchedules} />}
            </Grid>
        </Grid>
    );
};

TrainingSchedule.propTypes = {
    session_id: PropTypes.number
};

export default TrainingSchedule;
