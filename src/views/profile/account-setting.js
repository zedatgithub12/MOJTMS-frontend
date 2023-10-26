import { useState } from 'react';
import { Box, Button, Divider, Grid, Typography, useTheme } from '@mui/material';
import UserAccountModal from './components/updatemodal';

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
                lg={8}
                xl={8}
                sx={{
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginY: 2,
                        paddingX: 3
                    }}
                >
                    <Typography variant="h4">Account Settings</Typography>
                    <Button onClick={handleOpenModal}>Edit</Button>
                </Box>
                <Divider />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        marginY: 2,
                        paddingX: 3
                    }}
                >
                    <Typography variant="subtitle1" sx={{ marginBottom: 0.5 }}>
                        Name
                    </Typography>
                    <Typography color="grey">Zerihun Tegenu</Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        marginY: 2,
                        paddingX: 3
                    }}
                >
                    <Typography variant="subtitle1" sx={{ marginBottom: 0.5 }}>
                        Role
                    </Typography>
                    <Typography color="grey">Admin</Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        marginY: 2,
                        paddingX: 3
                    }}
                >
                    <Typography variant="subtitle1" sx={{ marginBottom: 0.5 }}>
                        Email address
                    </Typography>
                    <Typography color="grey">zerihuntegenu5@gmail.com</Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        marginY: 2,
                        paddingX: 3
                    }}
                >
                    <Typography variant="subtitle1" sx={{ marginBottom: 0.5 }}>
                        Phone
                    </Typography>
                    <Typography color="grey">(251) 949390840</Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        marginY: 2,
                        paddingX: 2
                    }}
                >
                    <Button>Change Password</Button>
                </Box>
            </Grid>
            <UserAccountModal open={modalOpen} onClose={handleCloseModal} />
        </Grid>
    );
};

export default AccountSetting;
