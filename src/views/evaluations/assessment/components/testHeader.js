import { IconButton, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconAlarm, IconArrowLeft } from '@tabler/icons';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { TimeFormatter } from 'utils/functions';
import CountdownTimer from 'utils/functions/countdowntimer';

//============================= ASSESSMENT TAKING HEADER COMPONENT =========================//

const TestHeader = ({ back, name, duration, onClick, status, onElapsed, sx }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleStatus = (status) => {
        onElapsed(status);
    };

    return (
        <Box
            sx={{
                border: 1,
                borderColor: theme.palette.primary[200],
                borderRadius: 2,
                backgroundColor: theme.palette.primary.light,
                paddingY: 1.6,
                paddingX: 2.2,
                marginTop: 1.6
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    {back && (
                        <IconButton onClick={() => navigate(-1)}>
                            <IconArrowLeft size={22} />
                        </IconButton>
                    )}

                    {name && (
                        <Typography variant="h4" onClick={onClick} sx={{ marginLeft: 1, cursor: 'pointer' }}>
                            {name}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    {status && status === 'taking' ? (
                        <CountdownTimer minutes={duration} StatusUpdate={handleStatus} />
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: theme.palette.primary[200],
                                padding: 0.8,
                                paddingX: 2,
                                border: 1,
                                borderRadius: 1,
                                borderColor: theme.palette.primary[200]
                            }}
                        >
                            <IconAlarm size={19} />
                            <Typography variant="body1" marginLeft={1}>
                                {TimeFormatter(duration)}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

TestHeader.propTypes = {
    back: PropTypes.bool,
    name: PropTypes.string,
    score: PropTypes.number,
    duration: PropTypes.number,
    status: PropTypes.string,
    onStart: PropTypes.func,
    onClick: PropTypes.func,
    sx: PropTypes.object,
    isSubmitting: PropTypes.string
};
export default TestHeader;
