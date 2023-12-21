import { useState } from 'react';
import { Grid, useTheme } from '@mui/material';
import { RefreshToken } from 'utils/token-refresh';
import { useQuery } from 'react-query';
import AccountInfo from './components/accountInfo';
import TraineeInfo from './components/traineeInfo';
import ChangePassword from './components/changePassword';
import Connections from 'api';

const AccountSetting = () => {
    const theme = useTheme();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [trainee, setTrainee] = useState([]);

    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchData();
        } else {
            FetchData();
        }
    };

    const FetchData = async () => {
        setLoading(true);

        let user = JSON.parse(sessionStorage.getItem('user'));

        var Api = Connections.api + Connections.userdata + user.user.id;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const resData = parsed.data;

            setData(resData.user);
            setTrainee(resData.trainee);

            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const { error } = useQuery(['data'], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    return (
        <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid
                item
                xs={12}
                sm={12}
                md={8}
                lg={6}
                xl={6}
                sx={{
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <AccountInfo userInfo={data} onRefresh={() => FetchData()} />
                {trainee[0] && <TraineeInfo traineeInfo={trainee[0]} onRefresh={() => FetchData()} />}
                <ChangePassword />
            </Grid>
        </Grid>
    );
};

export default AccountSetting;
