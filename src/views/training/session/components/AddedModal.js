import * as React from 'react';
import { Dialog, Button, useTheme, Typography } from '@mui/material';
import { IconCheck } from '@tabler/icons';
import { Box } from '@mui/system';

const AddedModal = ({ open, handleClose, onContinue }) => {
    const theme = useTheme();
    return (
        <Dialog open={open} onClose={handleClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                <Box
                    sx={{
                        width: 70,
                        height: 70,
                        borderRadius: 40,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: theme.palette.primary[200],
                        border: 2,
                        borderColor: theme.palette.secondary.light
                    }}
                >
                    <IconCheck size={56} color={theme.palette.primary.main} />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingX: 4 }}>
                <Typography variant="h3">Session Created successfully</Typography>

                <Typography variant="body2" marginY={1.5}>
                    Now, you can add the details right a way or come back later!
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                    <Button onClick={handleClose} variant="text" color="dark">
                        May be Later
                    </Button>
                    <Button onClick={onContinue} variant="contained" color="primary" sx={{ marginLeft: 2 }}>
                        Continue to Details
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default AddedModal;
