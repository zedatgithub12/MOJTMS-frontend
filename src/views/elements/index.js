// material-ui
import { Grid, Typography } from '@mui/material';
import DepartmentCard from 'ui-component/cards/DepartmentCard';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SYSTEM ELEMENTS PAGE ||============================== //

const Elements = () => (
    <MainCard title="Elements">
        <Grid container sx={{ flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ marginY: 1 }}>
                Department cards
            </Typography>
            <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                <DepartmentCard />
            </Grid>
        </Grid>
    </MainCard>
);

export default Elements;
