import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { TabPanel } from './tabpanel';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function a11yProps(index) {
    return {
        id: `department-tab-${index}`,
        'aria-controls': `department-tabpanel-${index}`
    };
}

function TMSTab({ tabsfor, children }) {
    const { t } = useTranslation();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box>
                <Tabs value={value} onChange={handleChange} aria-label="tabs">
                    {tabsfor.map((tab, index) => (
                        <Tab label={t(tab.name)} {...a11yProps(index)} />
                    ))}
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                {children}
            </TabPanel>
        </Box>
    );
}

TMSTab.propTypes = {
    tabsfor: PropTypes.array,
    children: PropTypes.node
};

export default TMSTab;
