import React, { useState } from 'react';

// material-ui
import { Typography, Grid, Skeleton, TableRow, TableCell, Table, TableHead, useTheme } from '@mui/material';
import { gridSpacing } from 'store/constant';

// project imports
import { useNavigate } from 'react-router';
import { formatDate } from 'utils/functions';
import { RefreshToken } from 'utils/token-refresh';
import { useQuery } from 'react-query';
import TotalTrainingCard from './components/TotalTrainingCard';
import TotalTraineeCard from './components/TotalTraineeCard';
import TotalTrainerCard from './components/TotalTrainerCard';
import UpcomingTrainings from './components/UpcomingsList';
import TrainingChart from './components/TrainingChart';
import Connections from 'api';
import UpcomingSkeleton from 'ui-component/cards/Skeleton/UpcomingSkeleton';
import DashboardAccordions from './components/DashboardAccordions';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        total_training: 0,
        total_sessions: 0,
        total_trainer: 0,
        total_trainee: 0,
        male_trainee: 0,
        female_trainee: 0,
        upcoming_trainings: [],
        monthly_trainees: [],
        training_cat: [],
        department_stat: []
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
        var Api = Connections.api + Connections.dashboard;
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
                total_training: resData.training_count,
                total_sessions: resData.sessions,
                total_trainer: resData.trainers_count,
                total_trainee: resData.total_trainees,
                male_trainee: resData.male_trainees,
                female_trainee: resData.female_trainees,
                upcoming_trainings: resData.upcomings_trainings,
                monthly_trainees: resData.monthly_trainees,
                training_cat: resData.training_cat,
                department_stat: resData.department_stat
            });

            setLoading(false);
        }
    };

    useQuery(['data'], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalTrainingCard isLoading={loading} total={data.total_training} sessions={data.total_sessions} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalTraineeCard
                            isLoading={loading}
                            total={data.total_trainee}
                            male={data.male_trainee}
                            female={data.female_trainee}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalTrainerCard isLoading={loading} total={data.total_trainer} />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={12} sm={12} md={8} lg={8} sx={{ paddingY: 4, paddingX: 2 }}>
                            <Typography variant="subtitle1" marginLeft={2}>
                                Male and Female trainee in each month
                            </Typography>

                            {loading ? (
                                <Grid container>
                                    <Grid item xs={12} paddingLeft={2}>
                                        <Skeleton
                                            variant="rounded"
                                            width={'98%'}
                                            height={400}
                                            sx={{ margin: 2, alignSelf: 'center', justifySelf: 'center' }}
                                        />
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container>
                                    <Grid item xs={12} paddingLeft={2}>
                                        {data && <TrainingChart data={data.monthly_trainees} width={'100%'} />}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>

                        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ paddingY: 4, paddingLeft: 2 }}>
                            <Typography variant="subtitle1" marginLeft={2}>
                                Upcoming Trainings
                            </Typography>
                            {loading ? (
                                <React.Fragment>
                                    <UpcomingSkeleton />
                                    <UpcomingSkeleton />
                                    <UpcomingSkeleton />
                                </React.Fragment>
                            ) : (
                                data &&
                                data.upcoming_trainings.map((item, index) => (
                                    <UpcomingTrainings
                                        key={index}
                                        name={item.training_name}
                                        round={item.round_number}
                                        start_date={formatDate(item.start_date)}
                                        end_date={formatDate(item.start_date)}
                                        onPress={() => navigate('/training/session/detail', { state: item })}
                                    />
                                ))
                            )}

                            <Typography variant="subtitle1" marginLeft={2}>
                                Summaries
                            </Typography>
                            <DashboardAccordions
                                departments={
                                    <Table sx={{ width: '100%' }} stickyHeader>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: theme.palette.primary[200] }}>
                                                <TableCell>Name</TableCell>
                                                <TableCell>M</TableCell>
                                                <TableCell>F</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {data &&
                                            data.department_stat.map((item, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        width: '100%',
                                                        '&:nth-of-type(odd)': {
                                                            backgroundColor: theme.palette.grey[100]
                                                        }
                                                    }}
                                                >
                                                    <TableCell>{item.department}</TableCell>
                                                    <TableCell>{item.male}</TableCell>
                                                    <TableCell>{item.female}</TableCell>
                                                </TableRow>
                                            ))}
                                    </Table>
                                }
                                categories={
                                    <Table sx={{ width: '100%' }} stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Training</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {data &&
                                            data.training_cat.map((item, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        width: '100%',
                                                        '&:nth-of-type(odd)': {
                                                            backgroundColor: theme.palette.grey[100]
                                                        }
                                                    }}
                                                >
                                                    <TableCell>{item.category}</TableCell>
                                                    <TableCell>{item.count}</TableCell>
                                                </TableRow>
                                            ))}
                                    </Table>
                                }
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
