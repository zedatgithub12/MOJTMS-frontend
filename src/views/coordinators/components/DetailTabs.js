import * as React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CustomTabPanel from 'views/trainee/components/TabPanel';

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`
    };
}

function DetailTabs({ details }) {
    const { t } = useTranslation();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="coordinator tabs">
                    <Tab label={t('Details')} {...a11yProps(0)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                {details}
            </CustomTabPanel>
        </Box>
    );
}

DetailTabs.propTypes = {
    details: PropTypes.node
};

export default DetailTabs;
