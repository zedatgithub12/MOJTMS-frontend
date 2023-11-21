// material-ui
import { Grid, Typography, useTheme } from '@mui/material';
// project imports
import { useNavigate } from 'react-router';

// ==============================|| SESSION PAGE ||============================== //

const TrainingSession = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Grid
            container
            sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: theme.palette.primary[200] + 25,
                ':hover': {
                    boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <Grid container sx={{ minHeight: 200, padding: 1 }}>
                <Typography variant="h2">Training Sessions</Typography>
                <Typography variant="h4">Under Development</Typography>
            </Grid>
        </Grid>
    );
};

export default TrainingSession;
