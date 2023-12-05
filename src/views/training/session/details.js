import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, useTheme, MenuItem, ListItemIcon, Divider, useMediaQuery, IconButton, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { IconEdit, IconListDetails, IconShare, IconTrash, IconX } from '@tabler/icons';
import DetailHeader from './components/DetailHeader';
import SessionDetailCard from 'ui-component/cards/SessionDetailCard';
import { FormattedRound, formatDate } from 'utils/functions';
import TabOne from './components/Tabone';
import Connections from 'api';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Delete } from 'ui-component/delete/Delete';
import { SessionStatus } from 'data/static/SessionStatus';
import ChangeStatus from './components/ChangeStatus';
import ShareDialog from 'ui-component/ShareDialog';
import TraineeTabContainer from './components/TraineeTabs';
import SessionActions from './Actions';
import { useQuery } from 'react-query';
import Accepted from './Actions/Accepted';
import { RefreshToken } from 'utils/token-refresh';

const SessionDetails = () => {
    const theme = useTheme();
    const { state } = useLocation();
    const navigate = useNavigate();

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;
    const uid = ActiveUser.user.id;

    const smallDevice = useMediaQuery(theme.breakpoints.down('md'));
    const activeIndex = SessionStatus.findIndex((item) => item === state.status); //find the index that match with current status of session

    const [openShare, setOpenShare] = useState(false);
    const [status, setStatus] = useState(state ? state.status : '');
    const [selectedIndex, setSelectedIndex] = useState(activeIndex);
    const [isUpdating, setIsUpdating] = useState(false);
    const [deleteSession, setDeleteSession] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [enrollmentstatus, setEnrollmentstatus] = useState('');
    const [loading, setLoading] = useState(false);

    const [trainee, setTrainee] = useState([]);
    const [enrollment, setEnrollment] = useState([]);
    const [enrolledcount, setEnrolledCount] = useState(7);
    //open survey
    const [openSurvey, setOpenSurvey] = useState(false);

    //assessment related states
    const [assessment, setAssessment] = useState({
        type: '',
        status: '',
        data: []
    });

    //survey related states
    const [surveys, setSurveys] = useState({
        status: '',
        data: []
    });

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchSessionDetail();
        } else {
            FetchSessionDetail();
        }
    };

    const FetchSessionDetail = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.trainingsession + '/' + state.id + `?uid=${uid}`;
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

            const count = data.totalcount;
            const EnrollmentInfo = data.enrollmentInfo;
            const TraineeInfo = data.traineeInfo;
            const assessments = parsed.assessment;
            const survey = parsed.survey;

            setEnrolledCount(count);
            setTrainee(TraineeInfo);
            EnrollmentInfo && setEnrollment(EnrollmentInfo);
            EnrollmentInfo && setEnrollmentstatus(EnrollmentInfo.enrollment_status);
            setAssessment({
                type: assessments.type,
                status: assessments.status,
                data: assessments.data
            });

            setSurveys({
                status: survey.status,
                data: survey.data
            });

            setLoading(false);
        }
    };

    useQuery(['data'], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    // Handle session status change here
    const handleSessionStatus = (newStatus) => {
        setIsUpdating(true);
        const Api = Connections.api + Connections.sessionStatus + state.id;
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
                    setStatus(newStatus);
                    const index = SessionStatus.findIndex((item) => item === newStatus);
                    setSelectedIndex(index);

                    handlePrompts(response.message, 'success');
                    setIsUpdating(false);
                } else {
                    handlePrompts(response.message, 'error');
                    setIsUpdating(false);
                }
            })
            .catch((error) => {
                handlePrompts(error, 'error');
                setIsUpdating(false);
            });
    };

    //handle status change
    const handleStatusChange = (index) => {
        const selectedStatus = SessionStatus[index];
        handleSessionStatus(selectedStatus);
    };

    //the following function handles delete session operation
    const handleDeleting = () => {
        setDeleting(true);

        var Api = Connections.api + Connections.trainingsession + '/' + state.id;
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
                    setDeleteSession(false);
                    handlePrompts(response.message, 'success');
                    navigate(-1);
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

    //handle share dialog open close functionality
    const handleShareDialogClose = () => {
        setOpenShare(false);
    };

    useEffect(() => {
        setTimeout(() => {
            if (surveys.status === 'exist') {
                setOpenSurvey(true);
            }
        }, 4000);
    });

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    return (
        <React.Fragment>
            {role === 'Admin' || role === 'Coordinator' ? (
                <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid
                        item
                        xs={11}
                        sx={{
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: theme.palette.primary[200] + 25,
                            ':hover': {
                                boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                            }
                        }}
                    >
                        <Grid
                            container
                            sx={{
                                minHeight: 240,
                                paddingBottom: 6,
                                background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`,
                                borderTopLeftRadius: 6,
                                borderTopRightRadius: 6
                            }}
                        >
                            <DetailHeader
                                back={true}
                                title={state.title}
                                option={role === 'Admin' || 'Coordinator' ? true : false}
                                optionChildrens={
                                    <Box>
                                        <MenuItem onClick={() => navigate('/training/session/update', { state: state })}>
                                            <ListItemIcon>
                                                <IconEdit size={18} />
                                            </ListItemIcon>
                                            Update
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem onClick={() => setDeleteSession(true)}>
                                            <ListItemIcon>
                                                <IconTrash size={18} />
                                            </ListItemIcon>
                                            Delete
                                        </MenuItem>
                                    </Box>
                                }
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={10}
                                    md={9}
                                    lg={9}
                                    xl={9}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        paddingBottom: 2
                                    }}
                                >
                                    <Box sx={{ marginX: 3, padding: 0.2 }}>
                                        {state.training_name ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2 }}>
                                                <Typography variant="subtitle1">{state.training_name} </Typography>{' '}
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: 60,
                                                        minHeight: 30,
                                                        borderRadius: 3,
                                                        padding: 1,
                                                        backgroundColor: theme.palette.background.default,
                                                        marginLeft: 2,
                                                        paddingX: 1
                                                    }}
                                                >
                                                    {state.round_number && (
                                                        <Typography variant="h4" color="primary">
                                                            {state.round_number} <sup>{FormattedRound(state.round_number)} </sup> Round
                                                        </Typography>
                                                    )}{' '}
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Typography variant="subtitle1">Training title</Typography>
                                        )}

                                        {state.round_name ? (
                                            <Typography variant="h3">{state.round_name}</Typography>
                                        ) : (
                                            <Typography variant="h4">Session title</Typography>
                                        )}
                                        {state.round_description && (
                                            <Typography
                                                variant="body2"
                                                marginTop={2}
                                                sx={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            >
                                                {state.round_description}
                                            </Typography>
                                        )}
                                        <ChangeStatus
                                            options={SessionStatus}
                                            onPress={(event, index) => handleStatusChange(index)}
                                            selectedIndex={selectedIndex}
                                            isUpdating={isUpdating}
                                        />
                                    </Box>
                                </Grid>
                            </DetailHeader>
                        </Grid>

                        <Grid
                            container
                            sx={{
                                justifyContent: 'center'
                            }}
                        >
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={9}
                                lg={9}
                                xl={9}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    paddingBottom: 2
                                }}
                            >
                                <Grid
                                    container
                                    sx={{
                                        display: 'flex',
                                        flexDirection: smallDevice ? 'column-reverse' : 'row',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        marginTop: -6
                                    }}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={8.6}
                                        lg={8.6}
                                        xl={8.6}
                                        sx={{
                                            minHeight: 400,
                                            paddingX: 2,
                                            borderRadius: 2,
                                            backgroundColor: theme.palette.background.default
                                        }}
                                    >
                                        {/* tabone for session details */}
                                        <TabOne training_id={state.training_id} session_id={state.id} />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={3.1} lg={3.1} xl={3.1} sx={{ paddingX: 2 }}>
                                        <SessionDetailCard
                                            isLoading={false}
                                            status={status}
                                            title="Training Details"
                                            startdate={formatDate(state.start_date)}
                                            enddate={formatDate(state.end_date)}
                                            address={state.address}
                                            capacity={state.maximum_capacity}
                                        />

                                        <Box
                                            sx={{
                                                minWidth: 380,
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                padding: 2.2,
                                                marginY: 2,
                                                borderRadius: 3,
                                                border: 1,
                                                borderColor: theme.palette.primary[200],

                                                ':hover': {
                                                    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                                                },
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => setOpenShare(true)}
                                        >
                                            <IconShare size={20} />
                                            <Typography variant="subtitle1" color="primary" marginLeft={2}>
                                                Share training
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {deleteSession && (
                        <Delete
                            type="Delete"
                            open={deleteSession}
                            title="Deleting Training Session"
                            description={`Are you sure you want to delete this session`}
                            onNo={() => setDeleteSession(false)}
                            onYes={() => handleDeleting()}
                            deleting={deleting}
                            handleClose={() => setDeleteSession(false)}
                        />
                    )}

                    <ShareDialog
                        open={openShare}
                        url={'https://tms.afrominadigitals.com/training/session/detail/'}
                        onClose={() => handleShareDialogClose()}
                    />

                    <SnackbarProvider maxSnack={3} />
                </Grid>
            ) : (
                <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid
                        item
                        xs={11}
                        sx={{
                            borderRadius: 4,
                            border: '1px solid',
                            borderColor: theme.palette.primary[200] + 25,
                            ':hover': {
                                boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                            }
                        }}
                    >
                        <Grid
                            container
                            sx={{
                                minHeight: 240,
                                paddingBottom: 6,
                                background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`,
                                borderTopLeftRadius: 6,
                                borderTopRightRadius: 6
                            }}
                        >
                            <DetailHeader
                                back={true}
                                title={state.title}
                                option={role === 'Admin' || 'Coordinator' ? true : false}
                                optionChildrens={
                                    <Box>
                                        <MenuItem onClick={() => navigate('/training/session/update', { state: state })}>
                                            <ListItemIcon>
                                                <IconEdit size={18} />
                                            </ListItemIcon>
                                            Update
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem onClick={() => setDeleteSession(true)}>
                                            <ListItemIcon>
                                                <IconTrash size={18} />
                                            </ListItemIcon>
                                            Delete
                                        </MenuItem>
                                    </Box>
                                }
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={10}
                                    md={9}
                                    lg={9}
                                    xl={9}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        paddingBottom: 2
                                    }}
                                >
                                    <Box sx={{ marginX: 3, padding: 0.2 }}>
                                        {state.training_name ? (
                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2 }}>
                                                <Typography variant="subtitle1">{state.training_name} </Typography>{' '}
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: 60,
                                                        minHeight: 30,
                                                        borderRadius: 3,
                                                        padding: 1,
                                                        backgroundColor: theme.palette.background.default,
                                                        marginLeft: 2,
                                                        paddingX: 1
                                                    }}
                                                >
                                                    {state.round_number && (
                                                        <Typography variant="h4" color="primary">
                                                            {state.round_number} <sup>{FormattedRound(state.round_number)} </sup> Round
                                                        </Typography>
                                                    )}{' '}
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Typography variant="subtitle1">Training title</Typography>
                                        )}

                                        {state.round_name ? (
                                            <Typography variant="h3">{state.round_name}</Typography>
                                        ) : (
                                            <Typography variant="h4">Session title</Typography>
                                        )}
                                        {state.round_description && (
                                            <Typography
                                                variant="body2"
                                                marginTop={2}
                                                sx={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            >
                                                {state.round_description}
                                            </Typography>
                                        )}

                                        {enrollmentstatus === 'accepted' ? (
                                            assessment.data && assessment.status === 'taken' ? (
                                                <Typography variant="subtitle1" marginTop={2}>
                                                    You have already taken {assessment.type} training assessment and
                                                    <b style={{ color: theme.palette.primary.main, fontSize: 14, marginLeft: 2 }}>
                                                        scored {assessment.data.score}%
                                                    </b>
                                                </Typography>
                                            ) : assessment.data && assessment.status === 'not taken' ? (
                                                <Accepted
                                                    type={assessment.type}
                                                    onTakeAssessment={() => navigate('/assessment/take', { state: assessment.data })}
                                                />
                                            ) : null
                                        ) : (
                                            <SessionActions
                                                isLoading={loading}
                                                session_id={state.id}
                                                enrollmentstatus={enrollmentstatus}
                                                enrolledcount={enrolledcount}
                                                trianeeenrollment={enrollment}
                                                trainee={trainee}
                                                reload={FetchSessionDetail}
                                            />
                                        )}
                                    </Box>
                                </Grid>
                            </DetailHeader>
                        </Grid>

                        <Grid
                            container
                            sx={{
                                justifyContent: 'center'
                            }}
                        >
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={9}
                                lg={9}
                                xl={9}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    paddingBottom: 2
                                }}
                            >
                                <Grid
                                    container
                                    sx={{
                                        display: 'flex',
                                        flexDirection: smallDevice ? 'column-reverse' : 'row',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        marginTop: -6
                                    }}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={8.6}
                                        lg={8.6}
                                        xl={8.6}
                                        sx={{
                                            minHeight: 400,
                                            paddingX: 2,
                                            borderRadius: 2,
                                            backgroundColor: theme.palette.background.default
                                        }}
                                    >
                                        {/* tabone for session details */}
                                        <TraineeTabContainer training_id={state.training_id} session_id={state.id} />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={3.1} lg={3.1} xl={3.1} sx={{ paddingX: 2 }}>
                                        <SessionDetailCard
                                            isLoading={false}
                                            status={status}
                                            title="Training Details"
                                            startdate={formatDate(state.start_date)}
                                            enddate={formatDate(state.end_date)}
                                            address={state.address}
                                            capacity={state.maximum_capacity}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {deleteSession && (
                        <Delete
                            type="Delete"
                            open={deleteSession}
                            title="Deleting Training Session"
                            description={`Are you sure you want to delete this session`}
                            onNo={() => setDeleteSession(false)}
                            onYes={() => handleDeleting()}
                            deleting={deleting}
                            handleClose={() => setDeleteSession(false)}
                        />
                    )}

                    <ShareDialog
                        open={openShare}
                        url={'https://tms.afrominadigitals.com/training/session/detail/'}
                        onClose={() => handleShareDialogClose()}
                    />

                    <SnackbarProvider maxSnack={3} />
                </Grid>
            )}

            {openSurvey && surveys.data && (
                <Box
                    sx={{
                        width: 380,
                        minHeight: 330,
                        float: 'right',
                        position: 'sticky',
                        right: 10,
                        bottom: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 1,
                        backgroundColor: theme.palette.background.default,
                        borderRadius: 2,
                        boxShadow: 4
                    }}
                >
                    <IconButton sx={{ position: 'absolute', top: 6, right: 8 }} onClick={() => setOpenSurvey(!openSurvey)}>
                        <IconX size={22} />
                    </IconButton>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <IconListDetails size={54} style={{ color: theme.palette.secondary.dark }} />

                        <Typography variant="h3" marginY={1}>
                            {state.round_name}
                        </Typography>
                        <Typography variant="body">Let's take some moment and fill this training survey </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 5, paddingX: 4, paddingY: 1 }}
                            onClick={() => navigate('/training/session/survey', { state: surveys.data })}
                        >
                            Take Survey
                        </Button>
                    </Box>
                </Box>
            )}
        </React.Fragment>
    );
};

export default SessionDetails;
