import { CircularProgress, Divider, Grid, IconButton, InputBase, Pagination, Paper, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { IconChevronDown, IconChevronUp, IconThumbDown, IconX } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import PropTypes from 'prop-types';
import TraineeListing from './components/TraineeListing';
import AssignedListing from './components/AssignedListing';

const TraineeEnrollment = ({ session_id }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const userstring = sessionStorage.getItem('user');
    const user = JSON.parse(userstring);
    const uid = user?.user.id;
    const role = user?.user.role;

    const [assigned, setAssigned] = useState([]);
    const [allTrainee, setAllTrainee] = useState([]);
    const [selectedTrainee, setSelectedTrainee] = useState();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
        total: 0,
        lastPage: 1
    });

    const [assigning, setAssigning] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [showEnrolled, setShowEnrolled] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleTextChange = (event) => {
        const value = event.target.value;
        setSearchText(value);
    };

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchTrainees();
        } else {
            FetchTrainees();
        }
    };

    const FetchTrainees = async () => {
        setLoading(true);
        var Api =
            Connections.api +
            Connections.sessionenrollments +
            session_id +
            `?uid=${uid}&role=${role}&page=${paginationModel.page}&limit=${paginationModel.pageSize}&search=${searchText}`;
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
            const allTrainee = parsed.trainees.data;
            setAssigned(data);
            setAllTrainee(allTrainee);
            setPaginationModel((prev) => ({ ...prev, lastPage: parsed?.trainees?.last_page }));
            setLoading(false);
        }
    };

    useQuery(['data', paginationModel.page], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (mounted) {
            const debouncing = setTimeout(() => {
                FetchTrainees();
            }, 800);

            return () => {
                clearTimeout(debouncing);
            };
        } else {
            setMounted(true);
        }
    }, [searchText]);

    //handle the work that should be done before the actual assignment operation
    const handleAssignInit = (traineeid) => {
        setSelectedTrainee(traineeid);
        handleInvitation(traineeid);
    };

    //submit the training to be added
    const handleInvitation = (traineeid) => {
        setAssigning(true);

        const Api = Connections.api + Connections.traineeenrollments;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        const data = {
            trainee_id: traineeid,
            session_id: session_id,
            enrollment_type: 'invited',
            enrollment_status: 'invited'
        };

        fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setAssigning(false);
                    handlePrompts(response.message, 'success');

                    FetchTrainees(); //fetch the updated trainees from database
                } else {
                    setAssigning(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setAssigning(false);
                handlePrompts(error, 'error');
            });
    };

    //handle the work that should be done before the actual remove operation
    const handleChangeInit = (traineeid, newStatus) => {
        setSelectedTrainee(traineeid);
        handleStatus(traineeid, newStatus);
    };

    // Handle trainee enrollment status here
    const handleStatus = (traineeid, newStatus) => {
        setIsChanging(true);
        const Api = Connections.api + Connections.enrollmentstatus + traineeid;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const formData = new FormData();
        formData.append('newstatus', newStatus);

        fetch(Api, { method: 'POST', headers: headers, body: formData })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setIsChanging(false);
                    handlePrompts(response.message, 'success');
                    FetchTrainees();
                } else {
                    handlePrompts(response.message, 'error');
                    setIsChanging(false);
                }
            })
            .catch((error) => {
                handlePrompts(error, 'error');
                setIsChanging(false);
            });
    };

    //handle the work that should be done before the actual remove operation
    const handleDeleteInit = (traineeid) => {
        setSelectedTrainee(traineeid);
        handleDeleting(traineeid);
    };

    //the following function handles remove assigned trainee
    const handleDeleting = (traineeid) => {
        setDeleting(true);

        var Api = Connections.api + Connections.traineeenrollments + '/' + traineeid;
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
                    handlePrompts(response.message, 'success');
                    FetchTrainees();
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

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    return (
        <Box padding={1}>
            <Paper sx={{ my: 1, p: '3px 4px', boxShadow: 1, display: 'flex', alignItems: 'center' }}>
                <InputBase
                    sx={{ py: 0.6, px: 1.5, boxShadow: 0, flex: 1 }}
                    placeholder={t('Search')}
                    inputProps={{ 'aria-label': 'search trainee' }}
                    value={searchText}
                    onChange={(event) => handleTextChange(event)}
                />
            </Paper>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 6 }}>
                    <CircularProgress size={22} />
                </Box>
            ) : assigned.length == 0 ? (
                <Box paddingY={3} paddingX={1}>
                    <Typography variant="subtitle1">{t('No trainee assigned to this training yet!')}</Typography>
                    <Typography variant="subtitle2">{t('After the trainees assignment, they will be listed here')}</Typography>
                </Box>
            ) : (
                <Grid container>
                    <Box
                        sx={{
                            backgroundColor: theme.palette.secondary.light,
                            borderRadius: 2,
                            width: '100%',
                            marginY: 1,
                            padding: 1,
                            paddingX: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Typography variant="subtitle1">{assigned.length} Trainee Enrolled</Typography>
                        <IconButton onClick={() => setShowEnrolled(!showEnrolled)}>
                            {showEnrolled ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
                        </IconButton>
                    </Box>
                    {showEnrolled && (
                        <Grid item xs={12}>
                            {assigned.map((trainee) => (
                                <AssignedListing
                                    key={trainee.id}
                                    name={trainee.name}
                                    education_level={trainee.dept_name}
                                    job_title={trainee.job_title}
                                    status={trainee.enrollment_status}
                                    onAccept={() => handleChangeInit(trainee.id, 'accepted')}
                                    isAccepting={
                                        trainee.id === selectedTrainee && isChanging ? (
                                            <CircularProgress size={18} sx={{ color: 'white' }} />
                                        ) : (
                                            t('Accept')
                                        )
                                    }
                                    isRemoving={
                                        <Box>
                                            {trainee.enrollment_status === 'pending' ? (
                                                <IconButton onClick={() => handleChangeInit(trainee.id, 'rejected')} disabled={isChanging}>
                                                    <IconThumbDown size={20} />
                                                </IconButton>
                                            ) : role === 'Coordinator' && trainee.enrollment_status !== 'accepted' ? (
                                                <IconButton onClick={() => handleDeleteInit(trainee.id)}>
                                                    {trainee.id === selectedTrainee && deleting ? (
                                                        <CircularProgress size={18} />
                                                    ) : (
                                                        <IconX size={20} />
                                                    )}
                                                </IconButton>
                                            ) : role === 'Admin' ? (
                                                <IconButton onClick={() => handleDeleteInit(trainee.id)}>
                                                    {trainee.id === selectedTrainee && deleting ? (
                                                        <CircularProgress size={18} />
                                                    ) : (
                                                        <IconX size={18} style={{ color: 'grey' }} />
                                                    )}
                                                </IconButton>
                                            ) : null}
                                        </Box>
                                    }
                                />
                            ))}
                        </Grid>
                    )}
                </Grid>
            )}

            {role === 'Admin' && allTrainee ? (
                <Box>
                    <Divider />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}></Box>
                    ) : allTrainee.length == 0 ? (
                        <Box paddingY={1.4} paddingX={1}>
                            <Typography variant="subtitle1">{t('No trainee to be assigned found!')}</Typography>
                            <Typography variant="subtitle2">
                                {t('Make sure you have trainee in the database and they are active')}
                            </Typography>
                        </Box>
                    ) : (
                        allTrainee.map((trainee) => (
                            <TraineeListing
                                key={trainee.id}
                                name={trainee.name}
                                education_level={trainee.dept_name}
                                job_title={trainee.job_title}
                                status={trainee.enrollment_status}
                                onAssign={() => handleAssignInit(trainee.id)}
                                isAssigning={
                                    trainee.id === selectedTrainee && assigning ? (
                                        <CircularProgress size={18} sx={{ color: 'primary' }} />
                                    ) : (
                                        t('Invite')
                                    )
                                }
                            />
                        ))
                    )}
                </Box>
            ) : role === 'Coordinator' && allTrainee ? (
                <Box>
                    <Divider />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}></Box>
                    ) : allTrainee.length == 0 ? (
                        <Box paddingY={1.4} paddingX={1}>
                            <Typography variant="subtitle1">{t('No trainee to be assigned found!')}</Typography>
                            <Typography variant="subtitle2">
                                {t('Make sure you have trainee in the database and they are active')}
                            </Typography>
                        </Box>
                    ) : (
                        allTrainee.map((trainee) => (
                            <TraineeListing
                                key={trainee.id}
                                name={trainee.name}
                                education_level={trainee.dept_name}
                                job_title={trainee.job_title}
                                status={trainee.enrollment_status}
                                onAssign={() => handleAssignInit(trainee.id)}
                                isAssigning={
                                    trainee.id === selectedTrainee && assigning ? (
                                        <CircularProgress size={18} sx={{ color: 'primary' }} />
                                    ) : (
                                        t('Invite')
                                    )
                                }
                            />
                        ))
                    )}
                </Box>
            ) : null}

            {paginationModel.lastPage > 1 && (
                <Box sx={{ paddingY: 4 }}>
                    <Pagination count={paginationModel.lastPage} page={paginationModel.page} onChange={handleChange} />
                </Box>
            )}

            <SnackbarProvider maxSnack={3} />
        </Box>
    );
};

TraineeEnrollment.propTypes = {
    session_id: PropTypes.number
};

export default TraineeEnrollment;
