import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { TabPanel } from './tabpanel';
import { useTheme } from '@mui/material';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export default function TMSTab({ tabsfor }) {
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
                        <Tab label={tab.name} {...a11yProps(index)} />
                    ))}
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                A list of trainings this department involved in will be listed here
            </TabPanel>
            <TabPanel value={value} index={1}>
                A list of trainees in this department will be listed here
            </TabPanel>
        </Box>
    );
}
