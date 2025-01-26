import { useEffect } from 'react';
import { Grid, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import HomeTabs from './components/Hometabs';
import TrainingSession from 'views/training/session';
import YourTrainings from './components/YourTrainings';
import CheckPathPermission from 'utils/path-checker';

const TraineeHome = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const isAllowedPath = CheckPathPermission(path);
        if (!isAllowedPath) {
            navigate('/');
        }
        return () => {};
    }, []);

    const getTraineeId = () => {
        const userString = sessionStorage.getItem('user');
        const userDetails = JSON.parse(userString);
        return userDetails.trainee[0]?.id;
    };

    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid
                item
                xs={12}
                sm={12}
                md={10}
                lg={10}
                xl={8}
                sx={{
                    minHeight: '80dvh',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: theme.palette.primary[200]
                }}
            >
                <HomeTabs home={<TrainingSession />} training={<YourTrainings trainee_id={getTraineeId()} />} />
            </Grid>
        </Grid>
    );
};

export default TraineeHome;
