// material-ui
import { Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// ==============================|| SKELETON - UPCOMING TRAINING CARD ||============================== //

const UpcomingSkeleton = () => (
    <Grid container direction="column" sx={{ border: 0.5, borderColor: '#eee', borderRadius: 2, padding: 2, my: 1.6 }}>
        <Grid item>
            <Skeleton variant="rectangular" sx={{ my: 1 }} height={20} />
        </Grid>
        <Grid item>
            <Skeleton variant="rectangular" height={12} />
        </Grid>
    </Grid>
);

export default UpcomingSkeleton;
