import { useState } from 'react';
// material-ui
import { Grid, Box, useTheme, MenuItem, ListItemIcon, Divider, Pagination } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { IconEdit, IconTrash } from '@tabler/icons';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Delete } from 'ui-component/delete/Delete';
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import TrainerDetailCard from 'ui-component/cards/TrainerDetailCard';
import TMSTab from './components/tab';
import TrainerTrainings from './components/Trainings';
import TrainersSurveys from './trainerssurveys';

const tabList = [{ name: 'Trainings' }, { name: 'Reviews' }];
// ==============================|| VIEW TRAINER PAGE ||============================== //

const ViewTrainer = () => {
    const { t } = useTranslation();
    const { state } = useLocation();
    const theme = useTheme();
    const navigate = useNavigate();

    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const role = user.user.role;

    const ImageApi = Connections.profiles;

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
            const trainer = parsed?.data?.trainerinfo;
            const trainings = parsed?.data?.trainings?.data;

            setTrainerInfo(trainer);
            setTrainings(trainings);
            setCounts(parsed?.data?.trainings.last_page);
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
        enqueueSnackbar(t(message), { severity });
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
                            {t('Update')}
                        </MenuItem>

                        {role === 'Admin' && (
                            <div>
                                <Divider />
                                <MenuItem onClick={() => setDeleteUser(true)}>
                                    <ListItemIcon>
                                        <IconTrash size={18} />
                                    </ListItemIcon>
                                    {t('Delete')}
                                </MenuItem>
                            </div>
                        )}
                    </Box>
                }
                sx={{ background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})` }}
            />

            <Grid container sx={{ minHeight: 200, padding: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Grid item xs={12} sm={12} md={12} lg={2} xl={2} sx={{ alignItems: 'center', justifyContent: 'center', paddingY: 3 }}>
                    <TrainerDetailCard
                        isLoading={loading}
                        image={trainerInfo.photo ? ImageApi + trainerInfo.photo : null}
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

                <Grid item xs={12} sm={12} md={12} lg={8} xl={8} sx={{ paddingY: 3 }}>
                    <TMSTab
                        tabsfor={tabList}
                        training={
                            <TrainerTrainings loading={loading} error={error} trainings={trainings} trainer_name={state.name}>
                                {count > 1 && (
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
                            </TrainerTrainings>
                        }
                        reviews={<TrainersSurveys trainer_id={state.id} />}
                    />
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
