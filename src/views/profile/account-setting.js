import { useState } from 'react';
import { Box, Button, Divider, Grid, Typography, useTheme } from '@mui/material';
import UserAccountModal from './components/updatemodal';
import AccountInfo from './components/accountInfo';
import TraineeInfo from './components/traineeInfo';
import ChangePassword from './components/changePassword';

const AccountSetting = () => {
    const theme = useTheme();
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

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
                <AccountInfo onEdit={() => handleOpenModal()} />
                <TraineeInfo />
                <ChangePassword />
            </Grid>
            <UserAccountModal open={modalOpen} onClose={handleCloseModal} />
        </Grid>
    );
};

export default AccountSetting;
