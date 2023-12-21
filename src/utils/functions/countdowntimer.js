import React, { useEffect, useState } from 'react';
import { Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconAlarm } from '@tabler/icons';
import PropTypes from 'prop-types';

const CountdownTimer = ({ minutes, StatusUpdate }) => {
    const theme = useTheme();
    const [time, setTime] = useState(minutes * 60);
    const [color, setColor] = useState(theme.palette.primary.main);

    useEffect(() => {
        const interval = setInterval(() => {
            if (time > 0) {
                setTime((prevTime) => prevTime - 1);
            } else {
                clearInterval(interval);
                setColor(theme.palette.error.dark);
                StatusUpdate('elapsed');
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [time]);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600)
            .toString()
            .padStart(2, '0');
        const minutes = Math.floor((time % 3600) / 60)
            .toString()
            .padStart(2, '0');
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <IconAlarm size={20} color={color} />
            <Typography variant="body1" marginLeft={1} color={color}>
                {formatTime(time)} remaining
            </Typography>
        </Box>
    );
};

CountdownTimer.propTypes = {
    minutes: PropTypes.number,
    StatusUpdate: PropTypes.func
};
export default CountdownTimer;
