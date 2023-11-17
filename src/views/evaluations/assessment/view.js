import { useState } from 'react';
import { Grid, Box, useTheme, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { TimeFormatter } from 'utils/functions';
import ViewHeader from './components/viewHeader';
import { IconArchive, IconArchiveOff, IconEdit } from '@tabler/icons';
import Connections from 'api';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

const ViewAssessement = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [publishing, setPublishing] = useState('init');

    // Handle assessment status change  here
    const handleAssessmentStatus = (newStatus) => {
        setPublishing('processing');
        const Api = Connections.api + Connections.assessmentStatus + state.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const formData = new FormData();
        formData.append('status', newStatus);

        fetch(Api, { method: 'POST', headers: headers, body: formData })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    handlePrompts(response.message, 'success');
                    setPublishing('done');
                } else {
                    handlePrompts(response.message, 'error');
                    setPublishing('init');
                }
            })
            .catch((error) => {
                handlePrompts(error, 'error');
                setPublishing('init');
            });
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    return (
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
            }}
        >
            <Grid
                item
                xs={11}
                sm={10}
                md={10}
                lg={8}
                xl={8}
                sx={{
                    marginBottom: 2,
                    minHeight: '90vh'
                }}
            >
                <ViewHeader
                    back={true}
                    name={state.assessment_name}
                    description={state.assessment_description}
                    score={state.passing_score}
                    duration={TimeFormatter(state.duration)}
                    instruction={state.instructions}
                    option={true}
                    status={state.status}
                    onPublish={() => handleAssessmentStatus('active')}
                    publishing={publishing}
                    sx={{}}
                    optionChildrens={
                        <Box>
                            <MenuItem onClick={() => navigate('/assessment/update', { state: state })}>
                                <ListItemIcon>
                                    <IconEdit size={18} />
                                </ListItemIcon>
                                Update
                            </MenuItem>
                            <Divider />
                            {state.status === 'active' && (
                                <MenuItem onClick={() => handleAssessmentStatus('archived')}>
                                    <ListItemIcon>
                                        <IconArchive size={18} />
                                    </ListItemIcon>
                                    Archive
                                </MenuItem>
                            )}

                            {state.status === 'archived' && (
                                <MenuItem onClick={() => handleAssessmentStatus('active')}>
                                    <ListItemIcon>
                                        <IconArchiveOff size={18} />
                                    </ListItemIcon>
                                    Un archive
                                </MenuItem>
                            )}
                        </Box>
                    }
                />
            </Grid>
            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default ViewAssessement;
