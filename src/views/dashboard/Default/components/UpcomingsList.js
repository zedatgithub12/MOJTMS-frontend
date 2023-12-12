import { Typography, Box, useTheme } from '@mui/material';
import { FormattedRound } from 'utils/functions';
import PropTypes from 'prop-types';

const UpcomingTrainings = ({ name, round, start_date, end_date, onPress }) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                marginX: 1.6,
                marginY: 1,
                padding: 1,
                border: 2,
                borderColor: theme.palette.primary[200],
                borderRadius: 2,
                cursor: 'pointer'
            }}
            onClick={onPress}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 0.5 }}>
                {name && <Typography variant="subtitle1">{name}</Typography>}

                {round && (
                    <Typography variant="body2" color="primary" marginLeft={1}>
                        {round} <sup>{FormattedRound(round)} </sup> Round
                    </Typography>
                )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 0.5 }}>
                <Typography variant="body2">{start_date}</Typography>
                <Typography variant="body2" marginLeft={1}>
                    {end_date}
                </Typography>
            </Box>
        </Box>
    );
};

UpcomingTrainings.propTypes = {
    name: PropTypes.string,
    round: PropTypes.number,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    onPress: PropTypes.func
};

export default UpcomingTrainings;
