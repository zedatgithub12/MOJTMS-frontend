import { useState } from 'react';
// project imports
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import TrainingSessionCard from 'ui-component/cards/TrainingSessionCard';
import { CircularProgress, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import Connections from 'api';
import { RefreshToken } from 'utils/token-refresh';
import { useNavigate } from 'react-router';

// ==============================|| SESSION LISTING COMPONENT ||============================== //

const SessionListing = ({ training_id }) => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);

    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            setRefreshed(true);
            FetchSessions();
        } else {
            FetchSessions();
        }
    };

    const FetchSessions = async () => {
        var Api = Connections.api + Connections.sessions + training_id;
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
            setSessions(data);
        }
    };

    const { isLoading, error } = useQuery(['data'], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingY: 2 }}>
            {isLoading ? (
                <CircularProgress size={22} />
            ) : (
                sessions.map((session) => (
                    <TrainingSessionCard
                        key={session.id}
                        isLoading={isLoading}
                        status={session.status}
                        title={session.round_name}
                        round={session.round_number}
                        address={session.address}
                        capacity={session.maximum_capacity}
                        startdate={session.start_date}
                        enddate={session.end_date}
                        onPress={() => navigate('/training/session/detail', { state: session })}
                    />
                ))
            )}
        </Box>
    );
};

SessionListing.propTypes = {
    training_id: PropTypes.number
};
export default SessionListing;
