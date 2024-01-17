import React, { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { SessionsTabs } from 'data/tabs/sessions';
import { TabPanel } from 'views/training/components/tabpanel';
import { useTranslation } from 'react-i18next';
import TrainingModules from 'views/training/module';
import TrainingSchedule from 'views/training/schedule';
import TrainingTrainers from 'views/training/trainer';
import TraineeEnrollment from 'views/training/trainee';
import TrainingAssessment from 'views/training/assessment';
import TrainingSurvey from 'views/training/survey';
import PropTypes from 'prop-types';
import TrainingFacilitators from 'views/training/facilitator';
import TrainingResources from 'views/training/resource';
import Review from 'views/training/review';

function a11yProps(index) {
    return {
        id: `training-tab-${index}`,
        'aria-controls': `training-tabpanel-${index}`
    };
}

const TabOne = ({ training_id, session_id }) => {
    const { t } = useTranslation();
    const [tab, setTab] = useState(0);
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <React.Fragment>
            <Tabs value={tab} onChange={handleChange} aria-label="tabs" variant="scrollable" scrollButtons="auto">
                {SessionsTabs.map((tab, index) => (
                    <Tab key={index} label={t(tab.name)} {...a11yProps(index)} />
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
                <TraineeEnrollment session_id={session_id} />
            </TabPanel>

            <TabPanel value={tab} index={4}>
                <TrainingAssessment session_id={session_id} />
            </TabPanel>

            <TabPanel value={tab} index={5}>
                <TrainingSurvey session_id={session_id} />
            </TabPanel>
            <TabPanel value={tab} index={6}>
                <TrainingFacilitators session_id={session_id} />
            </TabPanel>
            <TabPanel value={tab} index={7}>
                <TrainingResources session_id={session_id} />
            </TabPanel>
            <TabPanel value={tab} index={8}>
                <Review session_id={session_id} />
            </TabPanel>
        </React.Fragment>
    );
};

TabOne.propTypes = {
    training_id: PropTypes.number,
    session_id: PropTypes.number
};

export default TabOne;
