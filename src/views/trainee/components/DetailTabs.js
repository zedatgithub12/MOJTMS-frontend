import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CustomTabPanel from './TabPanel';

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`
    };
}

function DetailTabs({ details, training }) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="trainee tabs">
                    <Tab label="Details" {...a11yProps(0)} />
                    <Tab label="Trainings" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                {details}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                {training}
            </CustomTabPanel>
        </Box>
    );
}

DetailTabs.propTypes = {
    details: PropTypes.node,
    training: PropTypes.node
};

export default DetailTabs;
