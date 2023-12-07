import React, { useState } from 'react';
// project imports
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import TrainingSessionCard from 'ui-component/cards/TrainingSessionCard';
import { useQuery } from 'react-query';
import Connections from 'api';
import { RefreshToken } from 'utils/token-refresh';
import { useNavigate } from 'react-router';
import TrainingSessionSkel from 'ui-component/cards/Skeleton/TrainingSessionSkel';
import { NoResult } from 'utils/components/noresult';
import { GetBasicInfos } from 'utils/get-infos';

// ==============================|| SESSION LISTING COMPONENT ||============================== //

const SessionListing = ({ training_id }) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);

    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchSessions();
        } else {
            FetchSessions();
        }
    };

    const FetchSessions = async () => {
        setLoading(true);
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
            setLoading(false);
            const data = parsed.data;
            setSessions(data);
        } else {
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    return (
        <React.Fragment>
            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingY: 2 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                        <TrainingSessionSkel key={index} />
                    ))}
                </Box>
            ) : sessions.length === 0 ? (
                <NoResult title="" message="Oooops... No session found" />
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingY: 2 }}>
                    {sessions.map((session) => (
                        <TrainingSessionCard
                            key={session.id}
                            isLoading={loading}
                            status={session.status}
                            title={session.round_name}
                            round={session.round_number}
                            address={session.address}
                            capacity={session.maximum_capacity}
                            startdate={session.start_date}
                            enddate={session.end_date}
                            onPress={() => navigate('/training/session/detail', { state: session })}
                        />
                    ))}
                </Box>
            )}
        </React.Fragment>
    );
};

SessionListing.propTypes = {
    training_id: PropTypes.number
};
export default SessionListing;
