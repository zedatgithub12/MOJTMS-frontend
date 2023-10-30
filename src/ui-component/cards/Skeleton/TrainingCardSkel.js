// material-ui
import { Card, CardContent, Grid, useTheme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
// ==============================|| SKELETON - DEPARTMENT CARD ||============================== //

const TrainingCardSkel = () => {
    const theme = useTheme();
    return (
        <Card
            sx={{
                width: 280,
                border: '1px solid',
                borderColor: theme.palette.secondary.light,
                ':hover': {
                    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <Grid container direction="column">
                <Grid item justifyContent={'center'}>
                    <Skeleton variant="rectangular" width={'100%'} height={170} sx={{ borderTopRightRadius: 2, borderTopLeftRadius: 2 }} />
                </Grid>
                <Grid item justifyContent="space-between" paddingX={1}>
                    <Skeleton variant="rectangular" width={'100%'} height={20} sx={{ marginTop: 2, borderRadius: 2 }} />
                </Grid>
                <Grid item sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingX: 1 }}>
                    <Skeleton variant="rectangular" width={'30%'} height={12} sx={{ marginTop: 2, borderRadius: 2 }} />
                    <Skeleton variant="rectangular" width={'64%'} height={12} sx={{ marginTop: 2, borderRadius: 2 }} />
                </Grid>

                <Grid item sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingX: 1, marginY: 1 }}>
                    <Skeleton variant="rectangular" width={'30%'} height={30} sx={{ marginTop: 2, borderRadius: 2 }} />
                    <Skeleton variant="rectangular" width={'30%'} height={30} sx={{ marginTop: 2, borderRadius: 2 }} />
                    <Skeleton variant="rectangular" width={'30%'} height={30} sx={{ marginTop: 2, borderRadius: 2 }} />
                </Grid>

                <Grid item sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingX: 1, marginY: 2 }}>
                    <Skeleton variant="rectangular" width={'60%'} height={14} sx={{ marginTop: 2, borderRadius: 2 }} />
                </Grid>
            </Grid>
        </Card>
    );
};

export default TrainingCardSkel;
