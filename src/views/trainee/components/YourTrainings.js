import React, { useState } from 'react';
import { Typography, Box, Pagination } from '@mui/material';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { useNavigate } from 'react-router';
import { NoResult } from 'utils/components/noresult';
import TrainingSessionCard from 'ui-component/cards/TrainingSessionCard';
import Connections from 'api';
import TrainingSessionSkel from 'ui-component/cards/Skeleton/TrainingSessionSkel';
import PropTypes from 'prop-types';

// ==============================|| TRAINING LISTING COMPONENT ||============================== //

const YourTrainings = ({ trainee_id }) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [trainings, setTrainings] = useState([]);

    const [count, setCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    });

    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchTrainings();
        } else {
            FetchTrainings();
        }
    };

    const FetchTrainings = async () => {
        setLoading(true);
        var Api =
            Connections.api + Connections.traineestraining + trainee_id + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
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
            setTrainings(data.data);
            setCount(data.last_page);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    const handleChangePage = (event, value) => {
        setPaginationModel({
            ...paginationModel,
            page: value
        });
    };

    return (
        <React.Fragment>
            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingY: 2 }}>
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                        <TrainingSessionSkel key={index} />
                    ))}
                </Box>
            ) : trainings.length === 0 ? (
                <NoResult title="" message="Oooops... No session found" />
            ) : (
                <div>
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingY: 2 }}>
                        {trainings.map((training, index) => (
                            <Box key={index} margin={1}>
                                <Box sx={{ marginLeft: 2, display: 'flex', flexWrap: 'wrap' }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            textTransform: 'capitalize',
                                            paddingY: 1,
                                            borderTopLeftRadius: 4,
                                            borderTopRightRadius: 4
                                        }}
                                    >
                                        Enrollment | <b> {training.enrollment_status}</b>
                                    </Typography>
                                </Box>

                                <TrainingSessionCard
                                    isLoading={loading}
                                    status={training.session.status}
                                    title={training.session.training_name}
                                    round={training.session.round_number}
                                    address={training.session.address}
                                    capacity={training.session.maximum_capacity}
                                    startdate={training.session.start_date}
                                    enddate={training.session.end_date}
                                    onPress={() => navigate('/training/session/detail', { state: training.session })}
                                />
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ padding: 4 }}>
                        <Pagination showFirstButton showLastButton count={count} page={paginationModel.page} onChange={handleChangePage} />
                    </Box>
                </div>
            )}
        </React.Fragment>
    );
};

YourTrainings.propTypes = {
    trainee_id: PropTypes.number
};
export default YourTrainings;
