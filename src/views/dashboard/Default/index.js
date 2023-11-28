import { useEffect, useState } from 'react';

// material-ui
import { Typography, Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import { gridSpacing } from 'store/constant';
import UpcomingTrainings from './components/UpcomingsList';
import TrainingChart from './components/TrainingChart';
import GenderPieChart from './components/GenderPieChart';
import AgePieChart from './components/AgePieChart';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const malesCount = 832;
    const femalesCount = 1345;

    //age chart
    const olderThan30Count = 1680;
    const youngerThan30Count = 547;

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <EarningCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeDarkCard isLoading={isLoading} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeLightCard isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={8} sx={{ paddingY: 4, paddingX: 2 }}>
                            <Typography variant="subtitle1">Male and Female trainee in each month</Typography>
                            <TrainingChart />
                            <Grid container>
                                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <GenderPieChart males={malesCount} females={femalesCount} />
                                    <AgePieChart olderThan30={olderThan30Count} youngerThan30={youngerThan30Count} />
                                </Grid>
                            </Grid>
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
