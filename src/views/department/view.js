import { useState } from 'react';
// material-ui
import {
    Grid,
    Box,
    Typography,
    useTheme,
    CardMedia,
    useMediaQuery,
    Button,
    MenuItem,
    ListItemIcon,
    Divider,
    CircularProgress,
    Pagination
} from '@mui/material';
import { PageHeader } from 'ui-component/page-header/PageHeader';
import { useLocation, useNavigate } from 'react-router';
import Connections from 'api';
import { IconLabel } from 'ui-component/content/IconLabel';
import { IconArrowsExchange, IconEdit, IconMail, IconPhone, IconPlus, IconTrash, IconUser } from '@tabler/icons';
import FacilitatorCard from 'ui-component/cards/FacilitatorCard';
import TMSTab from 'views/department/components/tab';
import { DepartmentTabs } from 'data/tabs/department';
import { AssignCoordDialog } from './components/Dialog';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Delete } from 'ui-component/delete/Delete';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import DepartmentTrainees from './components/TraineeListing';

// ==============================|| VIEW DEPARTMENT PAGE ||============================== //

const ViewDepartment = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const thumbnailApi = Connections.thumbnails;
    const profileApi = Connections.profiles;
    const bigDevice = useMediaQuery(theme.breakpoints.up('md'));

    const { state } = useLocation();

    const [loading, setLoading] = useState(false);
    // const [data, setData] = useState([]);
    const [trainees, setTrainees] = useState([]);
    const [coordinatordata, setCoordinatorData] = useState([]); // the coordinator of this deparment
    const [coordfound, setCoordFound] = useState('');
    const [lastPage, setLastPage] = useState(1);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
        page: 1
    });

    const [coordinator, setCoordinator] = useState([]); //list of coordinators
    const [coordIsLoading, setCoordIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            DeparmentDetails();
        } else {
            DeparmentDetails();
        }
    };

    const DeparmentDetails = async () => {
        setLoading(true);
        var Api =
            Connections.api + Connections.departments + '/' + state.id + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}`;

        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const data = parsed.data;

            setTrainees(data.trainees.data);
            setLastPage(data.trainees.data.last_page);
            setCoordinatorData(data.coordinator);
            setCoordFound(data.where);
            setLoading(false);
        }
    };

    useQuery(['data', paginationModel], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

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

    //handle pagination here
    const handleChange = (event, value) => {
        setPaginationModel({
            ...paginationModel,
            page: value
        });
    };

    const handlePrompts = (message, severity) => {
        enqueueSnackbar(message, { severity });
    };

    return (
        <Grid container>
            <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={8}
                xl={8}
                sx={{
                    minHeight: 200,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: theme.palette.primary[200],
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
                                Update
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
                    sx={{ background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})` }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
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
                                    image={thumbnailApi + state.thumbnail}
                                    title={state.name}
                                />
                            </Box>
                        )}

                        <Box sx={{ marginX: 3, padding: 0.2 }}>
                            {state.name ? (
                                <Typography variant="h3" color="primary">
                                    {state.name}
                                </Typography>
                            ) : (
                                <Typography variant="h4">Department name</Typography>
                            )}
                            {state.description && (
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
                                        <IconMail size={18} style={{ color: theme.palette.secondary.main }} />
                                    </IconLabel>
                                )}

                                {state.phone && (
                                    <IconLabel content={state.phone}>
                                        <IconPhone size={18} style={{ color: theme.palette.secondary.main }} />
                                    </IconLabel>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </PageHeader>
                <TMSTab tabsfor={DepartmentTabs}>
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingY: 4 }}>
                            <CircularProgress size={24} color="primary" />
                        </Box>
                    ) : (
                        <div>
                            <DepartmentTrainees data={trainees} />

                            {trainees.length > paginationModel.pageSize && (
                                <Box sx={{ paddingY: 4 }}>
                                    <Pagination
                                        showFirstButton
                                        showLastButton
                                        count={lastPage}
                                        page={paginationModel.page}
                                        onChange={handleChange}
                                    />
                                </Box>
                            )}
                        </div>
                    )}
                </TMSTab>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={3} xl={3} sx={bigDevice ? { paddingX: 2 } : { paddingY: 2 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingY: 4 }}>
                        <CircularProgress size={24} color="primary" />
                    </Box>
                ) : coordinatordata && coordfound === 'coordinators' ? (
                    <FacilitatorCard
                        isLoading={false}
                        image={coordinatordata.photo ? profileApi + coordinatordata.photo : null}
                        qualification={coordinatordata.education}
                        title="Branch Coordinator"
                        name={coordinatordata.name}
                        address={coordinatordata.address}
                        gender={coordinatordata.gender}
                        phone={coordinatordata.phone}
                        email={coordinatordata.email}
                    />
                ) : coordinatordata && coordfound === 'users' ? (
                    <Box
                        sx={{
                            minWidth: 200,
                            minHeight: 200,
                            padding: 3,
                            backgroundColor: theme.palette.primary[200],
                            borderRadius: 3
                        }}
                    >
                        <IconLabel content={coordinatordata.name} label="Name">
                            <IconUser size={22} />
                        </IconLabel>
                        <IconLabel content={coordinatordata.email} label="Email">
                            <IconMail size={22} />
                        </IconLabel>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            minWidth: 200,
                            minHeight: 200,
                            padding: 3,
                            backgroundColor: theme.palette.primary[200],
                            borderRadius: 3,
                            display: 'flex',
                            flexDirection: 'row',
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
                onRefresh={() => handleFetching()}
            />

            {deleteUser && (
                <Delete
                    type="Delete"
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
