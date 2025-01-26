import { useState } from 'react';
import { Grid, useTheme } from '@mui/material';
import { RefreshToken } from 'utils/token-refresh';
import { useQuery } from 'react-query';
import AccountInfo from './components/accountInfo';
import TraineeInfo from './components/traineeInfo';
import ChangePassword from './components/changePassword';
import Connections from 'api';
import CoordinatorInfo from './components/coordinatorInfo';

const AccountSetting = () => {
    const theme = useTheme();
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const id = user.user.id;
    const role = user.user.role;

    const [data, setData] = useState([]);
    const [userData, setUserData] = useState([]);

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
        var Api = Connections.api + Connections.userdata + id;
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
            setUserData(resData.data);
        }
    };

    useQuery(['data'], () => handleDataFetching(), {
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
                {role === 'Coordinator'
                    ? userData[0] && <CoordinatorInfo coordinatorinfo={userData[0]} onRefresh={() => FetchData()} />
                    : userData[0] && <TraineeInfo traineeInfo={userData[0]} onRefresh={() => FetchData()} />}

                <ChangePassword />
            </Grid>
        </Grid>
    );
};

export default AccountSetting;
