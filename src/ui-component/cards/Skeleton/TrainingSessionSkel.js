// material-ui
import { Card, Grid, useTheme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
// ==============================|| SKELETON - TRAINING SESSION CARD ||============================== //

const TrainingSessionSkel = () => {
    const theme = useTheme();
    return (
        <Card
            sx={{
                width: 280,
                margin: 1,
                border: '1px solid',
                borderColor: theme.palette.secondary.light,
                ':hover': {
                    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <Grid container direction="column">
                <Grid item justifyContent={'center'}>
                    <Skeleton variant="rectangular" width={'100%'} height={150} sx={{ borderTopRightRadius: 2, borderTopLeftRadius: 2 }} />
                </Grid>
                <Grid item sx={{ display: 'flex', flexDirection: 'row', paddingX: 1 }}>
                    <Skeleton variant="rectangular" width={'40%'} height={10} sx={{ marginTop: 2, borderRadius: 1 }} />
                </Grid>

                <Grid item justifyContent="space-between" paddingX={1}>
                    <Skeleton variant="rectangular" width={'100%'} height={20} sx={{ marginTop: 1, borderRadius: 1 }} />
                </Grid>

                <Grid item justifyContent="space-between" paddingX={1}>
                    <Skeleton variant="rectangular" width={'96%'} height={14} sx={{ marginTop: 2.4, borderRadius: 1 }} />
                </Grid>

                <Grid item justifyContent="space-between" paddingX={1}>
                    <Skeleton variant="rectangular" width={'96%'} height={14} sx={{ marginTop: 2.4, borderRadius: 1 }} />
                </Grid>
                <Grid item justifyContent="space-between" paddingX={1}>
                    <Skeleton variant="rectangular" width={'96%'} height={14} sx={{ marginTop: 2.4, borderRadius: 1 }} />
                </Grid>
                <Grid item justifyContent="space-between" paddingX={1}>
                    <Skeleton variant="rectangular" width={'96%'} height={14} sx={{ marginY: 2.4, borderRadius: 2 }} />
                </Grid>
            </Grid>
        </Card>
    );
};

export default TrainingSessionSkel;
