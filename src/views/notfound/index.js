// material-ui
import { Grid, Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import notfound from 'assets/images/notfound.png';
import Logo from 'ui-component/Logo';

// ==============================|| PAGE NOT FOUND ||============================== //

const NotFound = () => {
    const theme = useTheme();
    return (
        <Box>
            <Box paddingX={4} sx={{ backgroundColor: '#f8f8f8' }}>
                <Typography component="a" href="/">
                    <Logo />
                </Typography>
            </Box>

            <Grid
                container
                margin="auto"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center'
                }}
            >
                <Grid item margin="auto" sx={{ marginY: 10, width: 500, height: 'auto' }}>
                    <img src={notfound} alt="Page Not Found " width="100%" />
                    <Typography variant="h2" sx={{ textAlign: 'center' }}>
                        Page Not Found
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', marginTop: 1 }}>
                        The page you are looking for doesn't exist!
                    </Typography>

                    <Box sx={{ alignSelf: 'center', textAlign: 'center', marginTop: 1 }}>
                        <Button component="a" href="/" sx={{ color: theme.palette.primary.dark }}>
                            Go Back{' '}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NotFound;
