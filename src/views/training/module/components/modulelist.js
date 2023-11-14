import { useState } from 'react';
// material-ui
import { Grid, Box, useTheme, CircularProgress, IconButton, Typography } from '@mui/material';
// project imports
import noresult from 'assets/images/no_result.png';
import errorImage from 'assets/images/error.jpg';
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { IconArchive, IconArchiveOff, IconChevronDown, IconChevronRight, IconEdit } from '@tabler/icons';
import { IconLabel } from 'ui-component/content/IconLabel';
import PropTypes from 'prop-types';
import UpdateModule from './updatemodule';
import { Delete } from 'ui-component/delete/Delete';
import Connections from 'api';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

const ModuleList = ({ modules, loading, error, sx }) => {
    const theme = useTheme();

    const [selectedModule, setSelectedModule] = useState(null);
    const [update, setUpdate] = useState(false);
    const [expand, setExpand] = useState(false);
    const [archive, setArchive] = useState(false);
    const [archiving, setArchiving] = useState(false);
    const [activating, setActivating] = useState(false);

    const handleExpnadCollapse = (mod) => {
        if (expand && selectedModule && selectedModule.id == mod.id) {
            setExpand(false);
        } else {
            setSelectedModule(mod);
            setExpand(true);
        }
    };

    const handleUpdateInit = (mod) => {
        setUpdate(true);
        setSelectedModule(mod);
    };

    const handleArchivingPanel = (mod) => {
        setSelectedModule(mod);
        setArchive(true);
    };

    // Handle module arching here
    const handleArchiving = () => {
        setArchiving(true);
        const Api = Connections.api + Connections.modulestatus + selectedModule.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('module_status', 'archive');

        fetch(Api, { method: 'POST', headers: headers, body: data })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setArchiving(false);
                    setArchive(false);
                    handlePrompts(response.message, 'success');
                } else {
                    setArchiving(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setArchiving(false);
                handlePrompts(error, 'error');
            });
    };

    //activate the archived modules
    const handleActivating = (module) => {
        setActivating(true);
        const Api = Connections.api + Connections.modulestatus + module.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();
        data.append('module_status', 'active');

        fetch(Api, { method: 'POST', headers: headers, body: data })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setActivating(false);

                    handlePrompts(response.message, 'success');
                } else {
                    setActivating(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setActivating(false);
                handlePrompts(error, 'error');
            });
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    return (
        <Grid container sx={{ ...sx }}>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }} spacing={1}>
                {loading ? (
                    <Grid container>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress size={20} />
                        </Grid>
                    </Grid>
                ) : error ? (
                    <ErrorPrompt image={errorImage} title="Server Error" message="Oooops... There is server error fetching modules!" />
                ) : modules.length == 0 ? (
                    <NoResult image={noresult} title="Result Not Found" message="Oooops... No module found in the moment!" />
                ) : (
                    modules.map((module) => (
                        <Box key={module.id}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginY: 0.5,
                                    paddingX: 1.2,
                                    borderRadius: 2,
                                    border: 0.1,
                                    borderColor: theme.palette.secondary.light,
                                    backgroundColor: selectedModule && selectedModule.id == module.id && theme.palette.secondary.light,
                                    cursor: 'pointer'
                                }}
                            >
                                <IconLabel
                                    content={module.module_title}
                                    sx={{ paddinY: 3 }}
                                    onTitleClick={() => handleExpnadCollapse(module)}
                                >
                                    <IconButton onClick={() => handleExpnadCollapse(module)}>
                                        {expand && selectedModule.id == module.id ? (
                                            <IconChevronDown size={16} />
                                        ) : (
                                            <IconChevronRight size={16} />
                                        )}
                                    </IconButton>
                                </IconLabel>

                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <IconButton onClick={() => handleUpdateInit(module)} title="Update">
                                        <IconEdit size={18} />
                                    </IconButton>

                                    {module.module_status == 'archive' ? (
                                        <IconButton
                                            onClick={() => handleActivating(module)}
                                            title="Un archive"
                                            disabled={activating ? true : false}
                                        >
                                            {activating ? <CircularProgress size={20} /> : <IconArchiveOff size={18} />}
                                        </IconButton>
                                    ) : (
                                        <IconButton onClick={() => handleArchivingPanel(module)} title="Archive">
                                            <IconArchive size={18} />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                            {expand && selectedModule && selectedModule.id == module.id && module.module_description && (
                                <Box sx={{ paddingLeft: 7, paddingY: 0.5 }}>
                                    <Typography variant="subtitle2" marginY={0.5}>
                                        Module description
                                    </Typography>
                                    <Typography variant="body2">{module.module_description}</Typography>
                                </Box>
                            )}
                        </Box>
                    ))
                )}
            </Grid>

            {update && selectedModule && (
                <UpdateModule
                    module={selectedModule}
                    handleClosePanel={() => setUpdate(false)}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 24,
                        zIndex: 2
                    }}
                />
            )}

            {/* A pop up modal to archive a module  */}
            {archive && (
                <Delete
                    type="Archive"
                    open={archive}
                    title="Archive Module"
                    description={`Are you sure you want to Archive ` + selectedModule.module_title}
                    onNo={() => setArchive(false)}
                    onYes={() => handleArchiving()}
                    deleting={archiving}
                    handleClose={() => setArchive(false)}
                />
            )}

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

ModuleList.propTypes = {
    modules: PropTypes.array,
    loading: PropTypes.bool,
    error: PropTypes.string,
    sx: PropTypes.object
};

export default ModuleList;
