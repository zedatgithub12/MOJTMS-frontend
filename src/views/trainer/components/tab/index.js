import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { TabPanel } from './tabpanel';
import { useTheme } from '@mui/material';
import PropTypes from 'prop-types';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export default function TMSTab({ tabsfor, training, reviews }) {
    const [value, setValue] = React.useState(0);

    const theme = useTheme();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: theme.palette.secondary.light }}>
                <Tabs value={value} onChange={handleChange} aria-label="tabs">
                    {tabsfor.map((tab, index) => (
                        <Tab key={index} label={tab.name} {...a11yProps(index)} />
                    ))}
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                {training}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {reviews}
            </TabPanel>
        </Box>
    );
}

TMSTab.propTypes = {
    tabsfor: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    training: PropTypes.node,
    reviews: PropTypes.node
};
