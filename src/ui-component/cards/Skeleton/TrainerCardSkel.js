// material-ui
import { Card, Box, Grid, useTheme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
// ==============================|| SKELETON - TRAINER CARD ||============================== //

const TrainerCardSkel = () => {
    const theme = useTheme();
    return (
        <Card
            sx={{
                width: 280,
                margin: 0.5,
                border: '1px solid',
                borderColor: theme.palette.secondary.light,
                ':hover': {
                    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <Grid direction="column" sx={{ padding: 1 }}>
                <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Skeleton variant="rectangular" width={'50%'} height={130} sx={{ borderRadius: 2 }} />
                    <Box width={'47%'}>
                        <Skeleton variant="rectangular" width={'100%'} height={13} sx={{ marginTop: 0.3, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'100%'} height={13} sx={{ marginTop: 2, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'100%'} height={13} sx={{ marginTop: 2, borderRadius: 2 }} />
                    </Box>
                </Grid>
                <Grid item justifyContent="center">
                    <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Skeleton variant="rectangular" width={'76%'} height={12} sx={{ marginTop: 3, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'16%'} height={12} sx={{ marginTop: 3, borderRadius: 2 }} />
                    </Box>

                    <Skeleton variant="rectangular" width={'100%'} height={18} sx={{ marginTop: 2, borderRadius: 2 }} />
                    <Skeleton variant="rectangular" width={'60%'} height={18} sx={{ marginTop: 1, borderRadius: 2 }} />
                </Grid>

                <Grid
                    item
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 5,
                        marginBottom: 1,
                        borderRadius: 2
                    }}
                >
                    <Skeleton variant="rectangular" width={'20%'} height={14} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rectangular" width={'46%'} height={14} sx={{ borderRadius: 2 }} />
                </Grid>
            </Grid>
        </Card>
    );
};

export default TrainerCardSkel;
