import { useState } from 'react';
// material-ui
import { Box, Grid, Pagination, Typography } from '@mui/material';
import { useQuery } from 'react-query';

// project imports
import { useNavigate } from 'react-router';
import { RefreshToken } from 'utils/token-refresh';
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { formatDate } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import TrainingSessionSkel from 'ui-component/cards/Skeleton/TrainingSessionSkel';
import SessionHorizontalCard from 'ui-component/cards/SessionHorizontalCard';
import SessionHorizontalSkel from 'ui-component/cards/Skeleton/SessionHorizontalSkel';
import errorImage from 'assets/images/error.jpg';
import TrainingSessionCard from 'ui-component/cards/TrainingSessionCard';

// ==============================|| SESSION PAGE | TRAINEE USER ROLE HOMEPAGE ||============================== //

const TrainingSession = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        upcomings: [],
        others: []
    });
    const [lastPage, setLastPage] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 1
    });

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchData();
        } else {
            FetchData();
        }
    };

    const FetchData = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.trainingsession + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const resData = parsed.data;

            setData({
                ...data,
                upcomings: resData.upcomings,
                others: resData.others.data
            });
            setLastPage(resData.others.last_page);
            setLoading(false);
        }
    };

    const { error } = useQuery(['data', paginationModel], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    const handleChange = (event, value) => {
        setPaginationModel({
            ...paginationModel,
            page: value
        });
    };

    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid xs={12} marginTop={4}>
                <Grid container>
                    <Grid item xs={12} sx={{ minHeight: 200, padding: 3 }}>
                        <Typography variant="h4" color="dark" marginBottom={2} marginLeft={1.4}>
                            {t('Upcoming Trainings')}
                        </Typography>
                        {loading ? (
                            <Grid container>
                                <Grid xs={12}>
                                    {[1, 2, 3].map((item) => (
                                        <SessionHorizontalSkel key={item} />
                                    ))}
                                </Grid>
                            </Grid>
                        ) : error ? (
                            <ErrorPrompt image={errorImage} title="" message="Oooops... There is server error fetching trainings!" />
                        ) : data.upcomings.length === 0 ? (
                            <NoResult title="" message="Oooops... no upcoming training" />
                        ) : (
                            data.upcomings &&
                            data.upcomings.map((training) => (
                                <SessionHorizontalCard
                                    isLoading={false}
                                    title={training.training_name}
                                    description={training.round_description}
                                    round={training.round_number}
                                    address={training.address}
                                    capacity={training.maximum_capacity}
                                    startdate={formatDate(training.start_date)}
                                    enddate={formatDate(training.end_date)}
                                    option={false}
                                    onPress={() => navigate('/training/session/detail', { state: training })}
                                />
                            ))
                        )}
                    </Grid>
                </Grid>

                <Grid container sx={{ padding: 3 }}>
                    <Grid item xs={12} sx={{ minHeight: 200, marginTop: 2 }}>
                        <Typography variant="h4" marginY={1} marginLeft={1.4}>
                            {t('Other Trainings')}
                        </Typography>
                        {loading ? (
                            <Grid container>
                                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                                        <TrainingSessionSkel key={index} />
                                    ))}
                                </Grid>
                            </Grid>
                        ) : error ? (
                            <ErrorPrompt image={errorImage} title="" message="Oooops... There is server error fetching trainings!" />
                        ) : data.others.length === 0 ? (
                            <NoResult title="" message="Oooops... no other training found" />
                        ) : (
                            <div>
                                <Grid
                                    item
                                    xs={12}
                                    sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingY: 3 }}
                                    spacing={1}
                                >
                                    {data.others.map((training) => (
                                        <TrainingSessionCard
                                            isLoading={false}
                                            status={training.status}
                                            title={training.training_name}
                                            round={training.round_number}
                                            address={training.address}
                                            capacity={training.maximum_capacity}
                                            startdate={training.start_date}
                                            enddate={training.end_date}
                                            onPress={() => navigate('/training/session/detail', { state: training })}
                                            sx={{ marginX: 1 }}
                                        />
                                    ))}
                                </Grid>
                                {lastPage > 1 && (
                                    <Box sx={{ paddingY: 4 }}>
                                        <Pagination
                                            showFirstButton
                                            showLastButton
                                            count={lastPage}
                                            page={paginationModel.page}
                                            onChange={handleChange}
                                        />
                                    </Box>
                                )}
                            </div>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default TrainingSession;
