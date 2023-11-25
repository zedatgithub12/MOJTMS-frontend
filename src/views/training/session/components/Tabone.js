import React, { useState } from 'react';
import { Tabs, Tab, Typography, Button } from '@mui/material';
import { SessionsTabs } from 'data/tabs/sessions';
import { TabPanel } from 'views/training/components/tabpanel';
import TrainingModules from 'views/training/module';
import TrainingSchedule from 'views/training/schedule';
import { useNavigate } from 'react-router';
import TrainingTrainers from 'views/training/trainer';

function a11yProps(index) {
    return {
        id: `training-tab-${index}`,
        'aria-controls': `training-tabpanel-${index}`
    };
}

const TabOne = ({ training_id, session_id }) => {
    const navigate = useNavigate();

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    const [tab, setTab] = useState(0);
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <React.Fragment>
            <Tabs value={tab} onChange={handleChange} aria-label="tabs">
                {SessionsTabs.map((tab, index) => (
                    <Tab label={tab.name} {...a11yProps(index)} />
                ))}
            </Tabs>
            <TabPanel value={tab} index={0}>
                {role === 'Admin' ? (
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={() => navigate('/training/schedule/create', { state: session_id })}
                    >
                        Add new schedule
                    </Button>
                ) : role === 'Coordinator' ? (
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={() => navigate('/training/schedule/create', { state: session_id })}
                    >
                        Add new schedule
                    </Button>
                ) : null}

                <TrainingSchedule session_id={session_id} />
            </TabPanel>

            <TabPanel value={tab} index={1}>
                <TrainingTrainers session_id={session_id} />
            </TabPanel>

            <TabPanel value={tab} index={2}>
                <TrainingModules training_id={training_id} />
            </TabPanel>

            <TabPanel value={tab} index={3}>
                <Typography variant="body2">Departments</Typography>
            </TabPanel>

            <TabPanel value={tab} index={4}>
                <Typography variant="body2">Trainees</Typography>
            </TabPanel>

            <TabPanel value={tab} index={5}>
                <Typography variant="body2">Reviews</Typography>
            </TabPanel>
        </React.Fragment>
    );
};

export default TabOne;
