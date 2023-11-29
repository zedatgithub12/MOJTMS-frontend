import React, { useState } from 'react';
import { Tabs, Tab, Typography } from '@mui/material';
import { TabPanel } from 'views/training/components/tabpanel';
import TrainingModules from 'views/training/module';
import TrainingSchedule from 'views/training/schedule';
import TrainingTrainers from 'views/training/trainer';
import TraineeEnrollment from 'views/training/trainee';
import PropTypes from 'prop-types';
import TrainingFacilitators from 'views/training/facilitator';
import TrainingResources from 'views/training/resource';
import { TraineeTabs } from 'data/tabs/traineetabs';
import Review from 'views/training/review';

function a11yProps(index) {
    return {
        id: `training-tab-${index}`,
        'aria-controls': `training-tabpanel-${index}`
    };
}

const TraineeTabContainer = ({ training_id, session_id }) => {
    const [tab, setTab] = useState(0);
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <React.Fragment>
            <Tabs value={tab} onChange={handleChange} aria-label="tabs" variant="scrollable" scrollButtons="auto">
                {TraineeTabs.map((tab, index) => (
                    <Tab label={tab.name} {...a11yProps(index)} />
                ))}
            </Tabs>
            <TabPanel value={tab} index={0}>
                <TrainingSchedule session_id={session_id} />
            </TabPanel>

            <TabPanel value={tab} index={1}>
                <TrainingModules training_id={training_id} />
            </TabPanel>

            <TabPanel value={tab} index={2}>
                <TrainingTrainers session_id={session_id} />
            </TabPanel>

            <TabPanel value={tab} index={3}>
                <TrainingFacilitators session_id={session_id} />
            </TabPanel>

            <TabPanel value={tab} index={4}>
                <TraineeEnrollment session_id={session_id} />
            </TabPanel>

            <TabPanel value={tab} index={5}>
                <TrainingResources session_id={session_id} />
            </TabPanel>

            <TabPanel value={tab} index={6}>
                <Review session_id={session_id} />
            </TabPanel>
        </React.Fragment>
    );
};

TraineeTabContainer.propTypes = {
    training_id: PropTypes.number,
    session_id: PropTypes.number
};

export default TraineeTabContainer;
