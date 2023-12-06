import { Button, Dialog, Grid, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconCircleCheck } from '@tabler/icons';
import PropTypes from 'prop-types';

export default function TakenDialog({ open, handleClose, onDone }) {
    const theme = useTheme();
    return (
        <Dialog open={open} onClose={handleClose} aria-describedby="alert-dialog-slide-description">
            <Grid container sx={{ width: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`,
                            padding: 6
                        }}
                    >
                        <IconCircleCheck size={76} style={{ color: theme.palette.secondary.main }} />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 3
                        }}
                    >
                        <Typography variant="h2">Successfully Submitted</Typography>

                        <Typography variant="subtitle1" marginTop={0.6}>
                            Thank you for your time
                        </Typography>

                        <Button variant="outlined" color="primary" onClick={onDone} sx={{ marginTop: 5, paddingX: 8, paddingY: 1 }}>
                            Done
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Dialog>
    );
}

TakenDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    onDone: PropTypes.func
};
