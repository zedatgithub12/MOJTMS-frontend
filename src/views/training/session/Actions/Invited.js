import { Button, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconInfoCircle } from '@tabler/icons';
import PropTypes from 'prop-types';

const Invited = ({ onAccept, onDecline, isChanging }) => {
    const theme = useTheme();

    return (
        <Box sx={{ marginTop: 2, marginBottom: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconInfoCircle size={18} color={theme.palette.primary.main} />
                <Typography variant="body1" color="primary" marginLeft={0.6}>
                    You are invited to take this training
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2, paddingY: 1.2, paddingX: 8 }}
                    onClick={onAccept}
                    disabled={isChanging}
                >
                    Accept
                </Button>
                <Button
                    variant="text"
                    color="primary"
                    sx={{ marginTop: 2, marginLeft: 3, paddingY: 1.2, paddingX: 2 }}
                    onClick={onDecline}
                    disabled={isChanging}
                >
                    Decline
                </Button>
            </Box>
        </Box>
    );
};

Invited.propTypes = {
    onAccept: PropTypes.func,
    onDecline: PropTypes.func
};
export default Invited;
