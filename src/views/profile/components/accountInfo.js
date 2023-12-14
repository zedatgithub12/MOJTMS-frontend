import { Box, Button, Divider, Grid, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

const AccountInfo = ({ onEdit }) => {
    const theme = useTheme();

    return (
        <Grid
            container
            sx={{
                borderRadius: 2,
                border: 1,
                borderColor: theme.palette.grey[300],
                backgroundColor: theme.palette.grey[100]
            }}
        >
            <Grid item xs={12} marginBottom={2}>
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
                    <Typography variant="h3">Account Settings</Typography>
                    <Button onClick={onEdit}>Edit</Button>
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
                        Zerihun Tegenu
                    </Typography>
                    <Typography color="grey"> Name </Typography>
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
                        zerihuntegenu5@gmail.com
                    </Typography>
                    <Typography color="grey"> Email address</Typography>
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
                        Admin
                    </Typography>
                    <Typography color="grey"> Role</Typography>
                </Box>
            </Grid>
        </Grid>
    );
};

export default AccountInfo;
