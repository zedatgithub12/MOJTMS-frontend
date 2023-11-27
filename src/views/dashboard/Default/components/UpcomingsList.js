import { Typography, Box, useTheme } from '@mui/material';
import { FormattedRound } from 'utils/functions';

const UpcomingTrainings = () => {
    const theme = useTheme();
    return (
        <Box sx={{ marginY: 1, padding: 1, border: 2, borderColor: theme.palette.primary[200], borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 0.5 }}>
                <Typography variant="subtitle1">Goal setting for better achievement</Typography>

                <Typography variant="body2" color="primary" marginLeft={1}>
                    {2} <sup>{FormattedRound(2)} </sup> Round
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 0.5 }}>
                <Typography variant="body2">Dec 2, 2023 | 8:00 am</Typography>
                <Typography variant="body2" marginLeft={1}>
                    Dec 3, 2023 | 5:00 pm
                </Typography>
            </Box>
        </Box>
    );
};

export default UpcomingTrainings;
