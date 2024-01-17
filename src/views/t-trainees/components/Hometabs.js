import * as React from 'react';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
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

function HomeTabs({ home, training }) {
    const { t } = useTranslation();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    position: 'sticky',
                    top: 75,
                    borderRadius: 4,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: theme.palette.background.default
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="trainee tabs"
                    sx={{ paddingTop: 2 }}
                    textColor="white"
                    indicatorColor="primary"
                >
                    <Tab label={t('Home')} {...a11yProps(0)} />
                    <Tab label={t('Your Tranings')} {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                {home}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                {training}
            </CustomTabPanel>
        </Box>
    );
}

HomeTabs.propTypes = {
    home: PropTypes.node,
    training: PropTypes.node
};

export default HomeTabs;
