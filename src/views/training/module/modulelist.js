import { useState } from 'react';
// material-ui
import { Grid, Box, useTheme, CircularProgress, IconButton, Typography, Divider, Button } from '@mui/material';
// project imports
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { IconArchive, IconArchiveOff, IconChevronDown, IconChevronRight, IconEdit } from '@tabler/icons';
import { IconLabel } from 'ui-component/content/IconLabel';
import { Delete } from 'ui-component/delete/Delete';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { AddMaterial } from 'views/materials/addmaterial';
import { useNavigate } from 'react-router';
import { UpdateMaterial } from 'views/materials/updatematerial';

import noresult from 'assets/images/no_result.png';
import errorImage from 'assets/images/error.jpg';
import PropTypes from 'prop-types';
import UpdateModule from './updatemodule';
import Connections from 'api';
import MaterialCard from 'ui-component/cards/materialCard';

const ModuleList = ({ modules, loading, error, sx }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    const [selectedModule, setSelectedModule] = useState(null);
    const [update, setUpdate] = useState(false);
    const [expand, setExpand] = useState(false);
    const [archive, setArchive] = useState(false);
    const [archiving, setArchiving] = useState(false);
    const [activating, setActivating] = useState(false);
    const [addMaterial, setAddMaterial] = useState(false);

    const [modMaterials, setModMaterials] = useState([]);
    const [modMaterialLoading, setModMaterialLoading] = useState(false);

    const [updateMaterial, setUpdateMaterial] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const handleExpnadCollapse = (mod) => {
        if (expand && selectedModule && selectedModule.id == mod.id) {
            setExpand(false);
        } else {
            handleFeatchingMaterials(mod);
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
        data.append('module_status', 'archived');

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
        setSelectedModule(module);
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

    //fetch a training materials
    const handleFeatchingMaterials = (mod) => {
        setModMaterialLoading(true);
        var Api = Connections.api + Connections.modulematerials + mod.id;

        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        fetch(Api, { method: 'GET', headers: headers })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setModMaterialLoading(false);
                    setModMaterials(response.data);
                } else {
                    setModMaterialLoading(false);
                }
            })
            .catch((error) => {
                setModMaterialLoading(false);
                handlePrompts(error, 'error');
            });
    };

    //handle adding material to the module
    const handleAddMaterial = () => {
        setAddMaterial(!addMaterial);
    };

    //handle adding material to the module
    const handleUpdateMaterial = (material) => {
        setUpdateMaterial(true);
        setSelectedMaterial(material);
    };

    // Handle material status change  here
    const handleMateriaStatus = (material) => {
        const Api = Connections.api + Connections.materialstatus + material.id;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const status = material.status === 'active' ? 'archived' : 'active';

        const data = new FormData();
        data.append('status', status);

        fetch(Api, { method: 'POST', headers: headers, body: data })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    const newData = modMaterials.filter((item) => item.id !== material.id);
                    setModMaterials(newData); //remove the archived item from the material list

                    handlePrompts(response.message, 'success');
                } else {
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                handlePrompts(error, 'error');
            });
    };

    // handle material download
    const handleFileDownload = (material) => {
        const folderName = material.file_type;
        const fileName = material.file;

        const Api = Connections.api + Connections.materialdownload + `?folderName=${folderName}&fileName=${fileName}`;

        fetch(Api, { method: 'GET', responseType: 'blob' })
            .then((response) => {
                if (response.status === 200) {
                    // Create a temporary URL for the blob
                    // const url = window.URL.createObjectURL(new Blob([response.data]));
                    const url = response.url;
                    // Create a temporary link element to trigger the download
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();

                    // Clean up the temporary objects after download
                    link.parentNode.removeChild(link);
                    window.URL.revokeObjectURL(url);
                } else {
                    // Handle error response
                    throw new Error('File download failed');
                }
            })
            .catch((error) => {
                // Handle fetch or download error
                console.error(error);
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
                ) : modules.length === 0 ? (
                    <NoResult title="" message="Oooops... No module found" />
                ) : (
                    modules.map((module, index) => (
                        <Box key={index}>
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
                                    borderColor: theme.palette.primary[200],
                                    backgroundColor: selectedModule && selectedModule.id == module.id && theme.palette.primary[200],
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

                                {role === 'Admin' ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <IconButton onClick={() => handleUpdateInit(module)} title="Update">
                                            <IconEdit size={18} />
                                        </IconButton>

                                        {module.module_status === 'archived' ? (
                                            <IconButton
                                                onClick={() => handleActivating(module)}
                                                title="Un archive"
                                                disabled={selectedModule.id == module.id && activating ? true : false}
                                            >
                                                {selectedModule.id == module.id && activating ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    <IconArchiveOff size={18} />
                                                )}
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => handleArchivingPanel(module)} title="Archive">
                                                <IconArchive size={18} />
                                            </IconButton>
                                        )}
                                    </Box>
                                ) : role === 'Coordinator' ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <IconButton onClick={() => handleUpdateInit(module)} title="Update">
                                            <IconEdit size={18} />
                                        </IconButton>

                                        {module.module_status === 'archived' ? (
                                            <IconButton
                                                onClick={() => handleActivating(module)}
                                                title="Un archive"
                                                disabled={selectedModule.id == module.id && activating ? true : false}
                                            >
                                                {selectedModule.id == module.id && activating ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    <IconArchiveOff size={18} />
                                                )}
                                            </IconButton>
                                        ) : (
                                            <IconButton onClick={() => handleArchivingPanel(module)} title="Archive">
                                                <IconArchive size={18} />
                                            </IconButton>
                                        )}
                                    </Box>
                                ) : null}
                            </Box>
                            {expand && selectedModule && selectedModule.id == module.id && (
                                <Box sx={{ paddingLeft: 1, paddingY: 0.5 }}>
                                    {module.module_description && (
                                        <Box>
                                            <Typography variant="subtitle2" marginY={0.5}>
                                                Module description
                                            </Typography>
                                            <Typography variant="body2">{module.module_description}</Typography>
                                        </Box>
                                    )}

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: 2
                                        }}
                                    >
                                        <Typography variant="subtitle1">Training Materials</Typography>
                                        {role === 'Admin' ? (
                                            <Button variant="text" color="primary" onClick={() => handleAddMaterial()}>
                                                Add New
                                            </Button>
                                        ) : role === 'Coordinator' ? (
                                            <Button variant="text" color="primary" onClick={() => handleAddMaterial()}>
                                                Add New
                                            </Button>
                                        ) : null}
                                    </Box>
                                    <Divider sx={{ marginY: 0.8 }} />

                                    <Box>
                                        {modMaterialLoading ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                                                <CircularProgress size={22} />
                                            </Box>
                                        ) : !modMaterialLoading && modMaterials.length == 0 ? (
                                            <NoResult
                                                image={noresult}
                                                title="Result Not Found"
                                                message="Oooops... No material found in the moment!"
                                            />
                                        ) : (
                                            modMaterials
                                                .slice(0, 5)
                                                .map((item) => (
                                                    <MaterialCard
                                                        key={item.id}
                                                        material={item}
                                                        onUpdate={() => handleUpdateMaterial(item)}
                                                        onArchive={() => handleMateriaStatus(item)}
                                                        onUnarchive={() => handleMateriaStatus(item)}
                                                        onDownload={() => handleFileDownload(item)}
                                                    />
                                                ))
                                        )}

                                        {selectedModule && modMaterials && modMaterials.length > 5 && (
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                sx={{ maxWidth: 180, py: 1, px: 4, my: 4 }}
                                                onClick={() => navigate('/training/module/materials', { state: selectedModule })}
                                            >
                                                More Materials
                                            </Button>
                                        )}
                                    </Box>
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

            {selectedModule && (
                <AddMaterial open={addMaterial} handleClose={() => setAddMaterial(false)} sx={{}} module_id={selectedModule.id} />
            )}

            {selectedModule && selectedMaterial && (
                <UpdateMaterial
                    open={updateMaterial}
                    handleClose={() => setUpdateMaterial(false)}
                    sx={{}}
                    materialInfo={selectedMaterial}
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
