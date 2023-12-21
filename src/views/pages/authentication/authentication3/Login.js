import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import group from 'assets/images/group_training.png';

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const matchUpSM = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                {matchUpSM && (
                                    <Grid
                                        container
                                        spacing={2}
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{
                                            p: { xs: 2, sm: 3, xl: 5 },
                                            background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`
                                        }}
                                    >
                                        <Grid item alignItems="center" justifyContent="center">
                                            <Link to="#">
                                                <Logo />
                                            </Link>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                direction={matchDownSM ? 'column-reverse' : 'row'}
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Grid item>
                                                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                        <Stack sx={{ flex: 'row', flexDirection: 'row' }}>
                                                            <Typography
                                                                color={theme.palette.primary.main}
                                                                gutterBottom
                                                                variant={matchDownSM ? 'h3' : 'h2'}
                                                            >
                                                                MOJ
                                                            </Typography>
                                                            <Typography
                                                                color={theme.palette.secondary.dark}
                                                                gutterBottom
                                                                variant={matchDownSM ? 'h3' : 'h2'}
                                                            >
                                                                TMS
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <img src={group} width="100%" height="300px" alt="MOJ creative" />
                                    </Grid>
                                )}

                                <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>
                                    {matchDownSM && (
                                        <Grid
                                            container
                                            spacing={2}
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{ p: { xs: 2, sm: 3, xl: 5 } }}
                                        >
                                            <Grid item alignItems="center" justifyContent="center">
                                                <Link to="#">
                                                    <Logo />
                                                </Link>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid
                                                    container
                                                    direction={matchDownSM ? 'column-reverse' : 'row'}
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Grid item>
                                                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                            <Stack sx={{ flex: 'row', flexDirection: 'row' }}>
                                                                <Typography
                                                                    color={theme.palette.primary.main}
                                                                    gutterBottom
                                                                    variant={matchDownSM ? 'h3' : 'h2'}
                                                                >
                                                                    MOJ
                                                                </Typography>
                                                                <Typography
                                                                    color={theme.palette.secondary.dark}
                                                                    gutterBottom
                                                                    variant={matchDownSM ? 'h3' : 'h2'}
                                                                >
                                                                    TMS
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center" justifyContent="center" marginBottom={1}>
                                            <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                                                Enter your credentials to continue
                                            </Typography>
                                        </Box>

                                        <AuthLogin />
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Login;
