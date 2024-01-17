import * as React from 'react';
import { TabPanel } from './tabpanel';
import { Tabs, Tab, Box, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export default function TMSTab({ tabsfor, training, reviews }) {
    const { t } = useTranslation();
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
                        <Tab key={index} label={t(tab.name)} {...a11yProps(index)} />
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
