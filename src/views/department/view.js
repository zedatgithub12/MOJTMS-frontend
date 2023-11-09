import { useState } from 'react';
// material-ui
import { Grid, Box, Typography, useTheme, CardMedia, useMediaQuery, Button, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { PageHeader } from 'ui-component/page-header/PageHeader';
import { useLocation, useNavigate } from 'react-router';
import Connections from 'api';
import { IconLabel } from 'ui-component/content/IconLabel';
import { IconArrowsExchange, IconEdit, IconMail, IconPhone, IconPlus, IconTrash } from '@tabler/icons';
import FacilitatorCard from 'ui-component/cards/FacilitatorCard';
import facilitator from 'assets/images/facilitator.jpg';
import TMSTab from 'views/department/components/tab';
import { DepartmentTabs } from 'data/tabs/department';
import { AssignCoordDialog } from './components/Dialog';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Delete } from 'ui-component/delete/Delete';

// ==============================|| VIEW DEPARTMENT PAGE ||============================== //

const ViewDepartment = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const ImageApi = Connections.thumbnails;
    const bigDevice = useMediaQuery(theme.breakpoints.up('md'));

    const { state } = useLocation();

    const [coordinator, setCoordinator] = useState([]);
    const [coordIsLoading, setCoordIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleOpenDialog = () => {
        setOpen(!open);
    };

    const handleCoordGet = () => {
        setOpen(true);

        if (coordinator.length == 0) {
            setCoordIsLoading(true);
            var Api = Connections.api + Connections.getusers + `?role=Coordinator`;
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
                        setCoordIsLoading(false);
                        setCoordinator(response.data);
                    } else {
                        setCoordIsLoading(false);
                        handlePrompts(response.message, 'error');
                    }
                })
                .catch((error) => {
                    setCoordIsLoading(false);
                    handlePrompts(error, 'error');
                });
        }
    };

    const handleCoordSearching = () => {
        setSearching(true);
        var Api = Connections.api + Connections.rolebasedsearch + `?role=Coordinator&name=${search}`;
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
                    setSearching(false);
                    setCoordinator(response.data);
                    console.log(response.data);
                } else {
                    setSearching(false);
                    handlePrompts(response.message, 'error');
                    console.log(response.message);
                }
            })
            .catch((error) => {
                setSearching(false);
                handlePrompts(error, 'error');
            });
    };

    const DeleteDepartment = () => {
        setDeleting(true);

        var Api = Connections.api + Connections.departments + '/' + state.id;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        fetch(Api, {
            method: 'DELETE',
            headers: headers
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setDeleting(false);
                    setDeleteUser(false);
                    navigate(-1);
                    handlePrompts(response.message, 'success');
                } else {
                    setDeleting(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setDeleting(false);
                handlePrompts(error.message, 'error');
            });
    };

    const handlePrompts = (message, severity) => {
        enqueueSnackbar(message, { severity });
    };

    return (
        <Grid
            container
            sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: theme.palette.primary[200] + 25,
                ':hover': {
                    boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <PageHeader
                back={true}
                title={state.name}
                option={true}
                optionChildrens={
                    <Box>
                        <MenuItem onClick={() => handleCoordGet()}>
                            <ListItemIcon>
                                <IconArrowsExchange size={18} />
                            </ListItemIcon>
                            Change Coordinator
                        </MenuItem>

                        <Divider />
                        <MenuItem onClick={() => navigate('/department/update', { state: state })}>
                            <ListItemIcon>
                                <IconEdit size={18} />
                            </ListItemIcon>
                            Edit
                        </MenuItem>

                        <Divider />
                        <MenuItem onClick={() => setDeleteUser(true)}>
                            <ListItemIcon>
                                <IconTrash size={18} />
                            </ListItemIcon>
                            Delete
                        </MenuItem>
                    </Box>
                }
                sx={{ backgroundColor: theme.palette.secondary.dark }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box sx={{ marginX: 3, padding: 0.2 }}>
                        {state.name ? (
                            <Typography variant="h3" color="white">
                                {state.name}
                            </Typography>
                        ) : (
                            <Typography variant="h4">Department name</Typography>
                        )}
                        {state.name && (
                            <Typography
                                variant="subtitle1"
                                marginTop={1}
                                sx={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            >
                                {state.description}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 1 }}>
                            {state.email && (
                                <IconLabel content={state.email} sx={{ marginRight: 2 }}>
                                    <IconMail size={20} color="white" />
                                </IconLabel>
                            )}

                            {state.phone && (
                                <IconLabel content={state.phone}>
                                    <IconPhone size={20} color="white" />
                                </IconLabel>
                            )}
                        </Box>
                    </Box>

                    {state.thumbnail && bigDevice && (
                        <Box>
                            <CardMedia
                                sx={{
                                    width: 120,
                                    height: 120,
                                    boxShadow: 2,
                                    borderRadius: 6,
                                    border: 4,
                                    borderColor: theme.palette.secondary.light
                                }}
                                image={ImageApi + state.thumbnail}
                                title={state.name}
                            />
                        </Box>
                    )}
                </Box>
            </PageHeader>

            <Grid container sx={{ minHeight: 200, padding: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <Grid item xs={12} sm={12} md={3} lg={2} xl={2} sx={{ alignItems: 'center', justifyContent: 'center', paddingY: 3 }}>
                    {state.coordinatorId ? (
                        <FacilitatorCard
                            isLoading={false}
                            image={facilitator}
                            qualification={'BSc'}
                            title="Semahagn Belew"
                            name="Branch Coordinator"
                            linkedin="https://mui.com/material-ui/react-card/"
                            address="Addis Ababa"
                            gender="Male"
                            trainingcount="24"
                            phone="+251949390840"
                            email="semahagn@gmail.com"
                            onPress={() => {
                                console.log('Facilitator clicked');
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                minWidth: 200,
                                minHeight: 200,
                                padding: 3,
                                backgroundColor: theme.palette.secondary.light,
                                borderRadius: 3,
                                display: 'flex',
                                flexDirection: 'flexDirection',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Button variant="text" color="primary" onClick={() => handleCoordGet()}>
                                <IconPlus size={16} /> Assign Coordinator
                            </Button>
                        </Box>
                    )}
                </Grid>

                <Grid item xs={12} sm={12} md={7} lg={8} xl={8} sx={{ alignItems: 'center', justifyContent: 'center', paddingY: 2 }}>
                    <TMSTab tabsfor={DepartmentTabs} />
                </Grid>
            </Grid>

            <AssignCoordDialog
                open={open}
                handleDialogClose={() => handleOpenDialog()}
                coordinators={coordinator}
                departmentId={state.id}
                isLoading={coordIsLoading}
                searchText={search}
                searching={searching}
                onTextChange={(event) => setSearch(event.target.value)}
                onSubmit={() => handleCoordSearching()}
            />

            {deleteUser && (
                <Delete
                    open={deleteUser}
                    title="Deleting Department"
                    description={`Are you sure you want to delete ` + state.name}
                    onNo={() => setDeleteUser(false)}
                    onYes={() => DeleteDepartment()}
                    deleting={deleting}
                    handleClose={() => setDeleteUser(false)}
                />
            )}

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default ViewDepartment;
