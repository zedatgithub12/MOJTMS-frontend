import { useEffect, useState } from 'react';

// material-ui
import { Avatar, Box, Typography, Divider, Grid, ListItemIcon, MenuItem } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import { PersonAdd } from '@mui/icons-material';
import Department from 'assets/images/department.jpg';
import SessionHorizontalCard from 'ui-component/cards/SessionHorizontalCard';
import { IconShare } from '@tabler/icons';

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
                            <Typography variant="subtitle1">Upcoming Trainings</Typography>
                            <SessionHorizontalCard
                                isLoading={false}
                                image={Department}
                                title="Technologies in Legal Field"
                                description="Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed in Ethiopia"
                                round="23rd"
                                level="Organization"
                                address="Addis Ababa"
                                capacity={2032}
                                startdate="Nov 12th"
                                enddate="Nov 22, 2023"
                                option={true}
                                optionChildrens={
                                    <>
                                        <MenuItem sx={{ padding: 1.5, paddingX: 2 }}>
                                            <IconShare size={20} />
                                            <Typography variant="subtitle1" sx={{ marginLeft: 2 }}>
                                                Share
                                            </Typography>
                                        </MenuItem>
                                    </>
                                }
                            />
                            <SessionHorizontalCard
                                isLoading={false}
                                image={Department}
                                title="Technologies in Legal Field"
                                description="Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed in Ethiopia"
                                round="23rd"
                                level="Organization"
                                address="Addis Ababa"
                                capacity={2032}
                                startdate="Nov 12th"
                                enddate="Nov 22, 2023"
                                option={true}
                                optionChildrens={
                                    <>
                                        <MenuItem sx={{ padding: 1.5, paddingX: 2 }}>
                                            <IconShare size={20} />
                                            <Typography variant="subtitle1" sx={{ marginLeft: 2 }}>
                                                Share
                                            </Typography>
                                        </MenuItem>
                                    </>
                                }
                            />
                            <SessionHorizontalCard
                                isLoading={false}
                                image={Department}
                                title="Technologies in Legal Field"
                                description="Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed in Ethiopia"
                                round="23rd"
                                level="Organization"
                                address="Addis Ababa"
                                capacity={2032}
                                startdate="Nov 12th"
                                enddate="Nov 22, 2023"
                                option={true}
                                optionChildrens={
                                    <>
                                        <MenuItem sx={{ padding: 1.5, paddingX: 2 }}>
                                            <IconShare size={20} />
                                            <Typography variant="subtitle1" sx={{ marginLeft: 2 }}>
                                                Share
                                            </Typography>
                                        </MenuItem>
                                    </>
                                }
                            />
                        </Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
