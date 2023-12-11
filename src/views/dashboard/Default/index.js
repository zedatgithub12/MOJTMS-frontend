import { useEffect, useState } from 'react';

// material-ui
import { Typography, Grid } from '@mui/material';

// project imports
import TotalTrainingCard from './TotalTrainingCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import { gridSpacing } from 'store/constant';
import UpcomingTrainings from './components/UpcomingsList';
import TrainingChart from './components/TrainingChart';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalTrainingCard isLoading={isLoading} />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeDarkCard isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={8} sx={{ paddingY: 4, paddingX: 2 }}>
                            <Typography variant="subtitle1">Male and Female trainee in each month</Typography>
                            <TrainingChart />
                        </Grid>
                        <Grid item xs={4} sx={{ paddingY: 4, paddingX: 2 }}>
                            <Typography variant="subtitle1">Upcoming Trainings</Typography>
                            <UpcomingTrainings />
                            <UpcomingTrainings />
                            <UpcomingTrainings />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
