// material-ui
import { Grid, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';

// project imports
import { useNavigate } from 'react-router';
import { MediumHeader } from 'ui-component/page-header/mediumHeader';

// ==============================|| CREATE SESSION PAGE ||============================== //

const CreateSession = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Grid container>
            <Grid container sx={{ display: 'flex', justifyContent: ' center', minHeight: 200, padding: 1, minHeight: '94dvh' }}>
                <Grid
                    item
                    xs={10}
                    sx={{
                        borderRadius: 4,
                        border: '2px solid',
                        background: theme.palette.primary.light,
                        borderColor: theme.palette.primary[200],
                        ':hover': {
                            boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                        }
                    }}
                >
                    <MediumHeader
                        title="Create Session"
                        back={true}
                        option={false}
                        sx={{ background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.primary.main})` }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h2">Create Training Sessions</Typography>
                        <Typography variant="h4">Under Development</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CreateSession;
