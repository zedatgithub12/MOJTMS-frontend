import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

export function TabPanel(props) {
    const { children, value, index, ...other } = props;
    const theme = useTheme();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`training-tabpanel-${index}`}
            aria-labelledby={`training-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};
