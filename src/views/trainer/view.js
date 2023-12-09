import { useState } from 'react';
// material-ui
import { Grid, Box, Typography, useTheme, MenuItem, ListItemIcon, Divider, Pagination } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import Connections from 'api';
import { IconEdit, IconTrash } from '@tabler/icons';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Delete } from 'ui-component/delete/Delete';
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import TrainerDetailCard from 'ui-component/cards/TrainerDetailCard';
import TrainingSessionCard from 'ui-component/cards/TrainingSessionCard';
import { useQuery } from 'react-query';
import TrainingSessionSkel from 'ui-component/cards/Skeleton/TrainingSessionSkel';
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import errorImage from 'assets/images/error.jpg';
// ==============================|| VIEW TRAINER PAGE ||============================== //

const ViewTrainer = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const ImageApi = Connections.profiles;

    const { state } = useLocation();

    const [loading, setLoading] = useState(false);
    const [trainerInfo, setTrainerInfo] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [deleteUser, setDeleteUser] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [count, setCounts] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
        page: 1
    });

    const handleCategoryFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchTarinerInfo();
        } else {
            FetchTarinerInfo();
        }
    };

    const FetchTarinerInfo = async () => {
        setLoading(true);
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
            const trainer = parsed.data.trainerinfo;
            const trainings = parsed.data.trainings.data;

            setTrainerInfo(trainer);
            setTrainings(trainings);
            setCounts(parsed.data.trainings.last_page);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const { error } = useQuery(['data', paginationModel], () => handleCategoryFetching(), {
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
        <Grid
            container
            sx={{
                borderRadius: 4,
                background: theme.palette.primary.light
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
                sx={{ background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})` }}
            />

            <Grid container sx={{ minHeight: 200, padding: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Grid item xs={12} sm={12} md={12} lg={2} xl={2} sx={{ alignItems: 'center', justifyContent: 'center', paddingY: 3 }}>
                    <TrainerDetailCard
                        isLoading={loading}
                        image={ImageApi + trainerInfo.photo}
                        title={trainerInfo.name}
                        gender={trainerInfo.gender}
                        email={trainerInfo.email}
                        address={trainerInfo.address}
                        phone={trainerInfo.phone}
                        specialisation={trainerInfo.specialisation}
                        qualification={trainerInfo.qualifications}
                        linkedin={trainerInfo.linkedin_profile}
                        language={trainerInfo.languages}
                        bio={trainerInfo.biography}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={8} xl={8} sx={{ alignItems: 'center', justifyContent: 'center', paddingY: 3 }}>
                    <Typography variant="h4">Training </Typography>
                    <Typography variant="body2">
                        {' '}
                        The training that given by <b> {state.name}</b>
                    </Typography>
                    {loading ? (
                        <Grid container>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                                    <TrainingSessionSkel key={index} />
                                ))}
                            </Grid>
                        </Grid>
                    ) : error ? (
                        <ErrorPrompt image={errorImage} title="" message="Oooops... There is server error fetching trainings!" />
                    ) : trainings.length === 0 ? (
                        <NoResult title="" message="Oooops... no training found" />
                    ) : (
                        <div>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingY: 3 }} spacing={1}>
                                {trainings.map((training) => (
                                    <TrainingSessionCard
                                        isLoading={false}
                                        status={training.session.status}
                                        title={training.session.training_name}
                                        round={training.session.round_number}
                                        address={training.session.address}
                                        capacity={training.session.maximum_capacity}
                                        startdate={training.session.start_date}
                                        enddate={training.session.end_date}
                                        onPress={() => navigate('/training/session/detail', { state: training.session })}
                                        sx={{ marginX: 1 }}
                                    />
                                ))}
                            </Grid>
                            {trainings.length > paginationModel.pageSize && (
                                <Box sx={{ paddingY: 4 }}>
                                    <Pagination
                                        showFirstButton
                                        showLastButton
                                        count={count}
                                        page={paginationModel.page}
                                        onChange={handleChange}
                                    />
                                </Box>
                            )}
                        </div>
                    )}
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
