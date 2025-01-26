// material-ui
import { Card, CardContent, Grid, useTheme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// ==============================|| SKELETON - TRAINERS CARD ||============================== //

const TrainerDetailsCardSkel = () => {
    const theme = useTheme();
    return (
        <Card
            sx={{
                width: 380,
                border: '1px solid',
                borderColor: theme.palette.secondary.light,
                ':hover': {
                    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <CardContent>
                <Grid container direction="column">
                    <Grid item justifyContent={'center'}>
                        <Skeleton variant="rectangular" width={'100%'} height={190} sx={{ borderRadius: 2 }} />
                    </Grid>
                    <Grid item justifyContent="center">
                        <Skeleton variant="rectangular" width={'100%'} height={20} sx={{ marginTop: 2, borderRadius: 2 }} />
                    </Grid>

                    <Grid item justifyContent="center">
                        <Skeleton variant="rectangular" width={'30%'} height={10} sx={{ marginTop: 2.4, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'100%'} height={14} sx={{ marginTop: 1, borderRadius: 2 }} />
                    </Grid>

                    <Grid item justifyContent="center">
                        <Skeleton variant="rectangular" width={'30%'} height={10} sx={{ marginTop: 3.4, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'100%'} height={14} sx={{ marginTop: 1, borderRadius: 2 }} />
                    </Grid>
                    <Grid item justifyContent="center">
                        <Skeleton variant="rectangular" width={'30%'} height={10} sx={{ marginTop: 3, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'100%'} height={14} sx={{ marginTop: 1, borderRadius: 2 }} />
                    </Grid>
                    <Grid item justifyContent="center">
                        <Skeleton variant="rectangular" width={'30%'} height={10} sx={{ marginTop: 3, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'100%'} height={8} sx={{ marginTop: 1, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'100%'} height={8} sx={{ marginTop: 1, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'100%'} height={8} sx={{ marginTop: 1, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'100%'} height={8} sx={{ marginTop: 1, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'50%'} height={8} sx={{ marginTop: 1, borderRadius: 2 }} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default TrainerDetailsCardSkel;
