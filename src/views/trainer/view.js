import { useState } from 'react';
// material-ui
import { Grid, Box, Typography, useTheme, useMediaQuery, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import Connections from 'api';
import { IconEdit, IconTrash } from '@tabler/icons';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Delete } from 'ui-component/delete/Delete';
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import TrainerDetailCard from 'ui-component/cards/TrainerDetailCard';
import TrainingSessionCard from 'ui-component/cards/TrainingCard';
import Office from 'assets/images/office.jpg';
import { useQuery } from 'react-query';

// ==============================|| VIEW TRAINER PAGE ||============================== //

const ViewTrainer = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const ImageApi = Connections.profiles;
    const bigDevice = useMediaQuery(theme.breakpoints.up('md'));

    const { state } = useLocation();

    const [trainerInfo, setTrainerInfo] = useState([]);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [rowCountState] = useState(lastPage);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
        page: 1
    });

    const handleCategoryFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            setRefreshed(true);
            FetchTarinerInfo();
        } else {
            FetchTarinerInfo();
        }
    };

    const FetchTarinerInfo = async () => {
        var Api = Connections.api + Connections.trainers + `/${state.id}?page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            setLastPage(parsed.data.last_page);
            const data = parsed.data.data;
            setTrainerInfo(data);
        }
    };

    const { isLoading, error } = useQuery(['data', paginationModel], () => handleCategoryFetching(), {
        refetchOnWindowFocus: false
    });

    const DeleteTrainer = () => {
        setDeleting(true);

        var Api = Connections.api + Connections.trainers + '/' + state.id;
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
            <MiniHeader
                back={true}
                title="Trainer Details"
                option={true}
                optionChildrens={
                    <Box>
                        <MenuItem onClick={() => navigate('/trainer/update', { state: state })}>
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
                sx={{ background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.secondary.main})` }}
            />

            <Grid container sx={{ minHeight: 200, padding: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Grid item xs={12} sm={12} md={12} lg={2} xl={2} sx={{ alignItems: 'center', justifyContent: 'center', paddingY: 3 }}>
                    <TrainerDetailCard
                        isLoading={isLoading}
                        image={ImageApi + state.photo}
                        title={state.name}
                        gender={state.gender}
                        email={state.email}
                        address={state.address}
                        phone={state.phone}
                        specialisation={state.specialisation}
                        qualification={state.qualifications}
                        linkedin={state.linkedin_profile}
                        language={state.languages}
                        bio={state.biography}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={8} xl={8} sx={{ alignItems: 'center', justifyContent: 'center', paddingY: 3 }}>
                    <Typography variant="h4">Training </Typography>
                    <Typography variant="body2"> The training that given by this trainer will be listed here</Typography>
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingY: 3 }} spacing={1}>
                        <TrainingSessionCard
                            isLoading={false}
                            image={Office}
                            title="Modern Technologies in Legal Field"
                            round="23rd"
                            level="Organization"
                            address="Addis Ababa"
                            capacity={2032}
                            startdate="Nov 12th"
                            enddate="Nov 22, 2023"
                            onPress={() => {
                                console.log('Training session clicked');
                            }}
                            sx={{ marginX: 1 }}
                        />

                        <TrainingSessionCard
                            isLoading={false}
                            image={Office}
                            title="Modern Technologies in Legal Field"
                            round="23rd"
                            level="Organization"
                            address="Addis Ababa"
                            capacity={2032}
                            startdate="Nov 12th"
                            enddate="Nov 22, 2023"
                            onPress={() => {
                                console.log('Training session clicked');
                            }}
                            sx={{ marginX: 1 }}
                        />
                        <TrainingSessionCard
                            isLoading={false}
                            image={Office}
                            title="Modern Technologies in Legal Field"
                            round="23rd"
                            level="Organization"
                            address="Addis Ababa"
                            capacity={2032}
                            startdate="Nov 12th"
                            enddate="Nov 22, 2023"
                            onPress={() => {
                                console.log('Training session clicked');
                            }}
                            sx={{ marginX: 1 }}
                        />
                    </Grid>
                </Grid>
                <SnackbarProvider maxSnack={3} />
            </Grid>

            {deleteUser && (
                <Delete
                    open={deleteUser}
                    title="Deleting Trainer"
                    description={`Are you sure you want to delete ` + state.name}
                    onNo={() => setDeleteUser(false)}
                    onYes={() => DeleteTrainer()}
                    deleting={deleting}
                    handleClose={() => setDeleteUser(false)}
                />
            )}
        </Grid>
    );
};

export default ViewTrainer;
