// material-ui
import { Card, CardContent, Grid, useTheme } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
// ==============================|| SKELETON - DEPARTMENT CARD ||============================== //

const DepartmentCardSkel = () => {
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
            <CardContent>
                <Grid container direction="column">
                    <Grid item justifyContent={'center'}>
                        <Skeleton variant="rectangular" width={'100%'} height={128} sx={{ borderRadius: 2 }} />
                    </Grid>
                    <Grid item justifyContent="center">
                        <Skeleton variant="rectangular" width={'100%'} height={24} sx={{ marginTop: 2, borderRadius: 2 }} />
                        <Skeleton variant="rectangular" width={'100%'} height={14} sx={{ marginTop: 2, borderRadius: 4 }} />
                        <Skeleton variant="rectangular" width={'100%'} height={14} sx={{ marginTop: 2, borderRadius: 4 }} />
                    </Grid>

                    <Grid item sx={{ display: 'flex', flexDirection: 'row', marginTop: 5, borderRadius: 2 }}>
                        <Skeleton variant="rectangular" width={'28%'} height={24} sx={{ borderRadius: 4 }} />
                        <Skeleton variant="rectangular" width={'28%'} height={24} sx={{ marginX: 2, borderRadius: 4 }} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default DepartmentCardSkel;
