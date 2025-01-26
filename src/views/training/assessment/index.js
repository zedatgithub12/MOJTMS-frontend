import React, { useState } from 'react';
import { Button, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { Box } from '@mui/system';
import { IconPlus } from '@tabler/icons';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import AssessmentListing from './components/Listing';
import Connections from 'api';

const TrainingAssessment = ({ session_id }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));

    const [pre, setPre] = useState(null);
    const [post, setPost] = useState(null);
    const [allAssessment, setAllAssessment] = useState([]);
    const [selected, setSelected] = useState({
        status: false,
        type: ''
    });

    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [removing, setRemoving] = useState(false);

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchAssessments();
        } else {
            FetchAssessments();
        }
    };

    const FetchAssessments = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.sessionassessment + session_id;
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
            const assessments = parsed.assessments;

            const pre = data.filter((item) => item.assessment_type === 'pre');
            pre && setPre(...pre);

            const post = data.filter((item) => item.assessment_type === 'post');
            post && setPost(...post);

            setAllAssessment(assessments);
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    const handlePreSelection = () => {
        if (selected.status) {
            setSelected({ ...selected, status: false, type: '' });
        } else {
            setSelected({ ...selected, status: true, type: 'pre' });
        }
    };

    const handlePostSelection = () => {
        if (selected.status) {
            setSelected({ ...selected, status: false, type: '' });
        } else {
            setSelected({ ...selected, status: true, type: 'post' });
        }
    };

    //handle the assessment addition to a training session
    const handleAssessmentAddition = (assessment) => {
        setAssigning(true);

        const Api = Connections.api + Connections.trainingassessment;
        const token = sessionStorage.getItem('token');

        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        var assigned_by = ActiveUser.user.id;

        const data = {
            session_id: session_id,
            assessment_id: assessment.id,
            assessment_type: selected.type,
            added_by: assigned_by
        };

        fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setSelected({
                        ...selected,
                        status: false,
                        type: ''
                    });
                    setAssigning(false);
                    handlePrompts(response.message, 'success');
                    FetchAssessments(); //fetch the updated assessment from database
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

    //the following function handles remove selected assessments
    const handleRemoving = (recordid) => {
        setRemoving(true);

        var Api = Connections.api + Connections.trainingassessment + '/' + recordid;
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
                    setRemoving(false);
                    handlePrompts(response.message, 'success');
                    FetchAssessments();
                } else {
                    setRemoving(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setRemoving(false);
                handlePrompts(error.message, 'error');
            });
    };
    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(t(message), { variant });
    };

    return (
        <React.Fragment>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 6 }}>
                    <CircularProgress size={22} />
                </Box>
            ) : (
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', padding: 1 }}>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    backgroundColor: theme.palette.primary[200],
                                    padding: 1,
                                    margin: 1,
                                    borderRadius: 2,
                                    border: selected.status && selected.type === 'pre' ? 2 : 0,
                                    borderColor: theme.palette.primary.main,
                                    cursor: 'pointer'
                                }}
                            >
                                {pre ? (
                                    <AssessmentListing
                                        name={pre.assessment_name}
                                        question={pre.question_count}
                                        duration={pre.duration}
                                        score={pre.passing_score}
                                        selected={selected.status}
                                        actionButton={
                                            <Button
                                                variant="text"
                                                color="primary"
                                                disabled={removing}
                                                onClick={() => handleRemoving(pre.id)}
                                            >
                                                {t('Remove')}
                                            </Button>
                                        }
                                        type={t('Pre')}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 1
                                        }}
                                        onClick={() => handlePreSelection()}
                                    >
                                        <IconPlus size={24} />
                                        <Typography variant="subtitle1" marginLeft={2}>
                                            {t('Pre Training Assessment')}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                sx={{
                                    backgroundColor: theme.palette.primary[200],
                                    padding: 1,
                                    borderRadius: 2,
                                    margin: 1,
                                    marginTop: 2,
                                    border: selected.status && selected.type === 'post' ? 2 : 0,
                                    borderColor: theme.palette.primary.main,
                                    cursor: 'pointer'
                                }}
                            >
                                {post ? (
                                    <AssessmentListing
                                        name={post.assessment_name}
                                        question={post.question_count}
                                        duration={post.duration}
                                        score={post.passing_score}
                                        selected={selected.status}
                                        actionButton={
                                            <Button
                                                variant="text"
                                                color="primary"
                                                disabled={removing}
                                                onClick={() => handleRemoving(post.id)}
                                            >
                                                {t('Remove')}
                                            </Button>
                                        }
                                        type={t('post')}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 1
                                        }}
                                        onClick={() => handlePostSelection()}
                                    >
                                        <IconPlus size={24} />
                                        <Typography variant="subtitle1" marginLeft={2}>
                                            {t('Post Training Assessment')}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={12} marginTop={0.4} padding={1}>
                            {allAssessment.map((item) => (
                                <AssessmentListing
                                    key={item.id}
                                    name={item.assessment_name}
                                    question={item.question_count}
                                    duration={item.duration}
                                    score={item.passing_score}
                                    selected={selected.status}
                                    actionButton={
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={!selected.status || assigning ? true : false}
                                            onClick={() => handleAssessmentAddition(item)}
                                        >
                                            {t('Select')}
                                        </Button>
                                    }
                                />
                            ))}
                        </Grid>
                    </Grid>
                    <SnackbarProvider maxSnack={3} />
                </Grid>
            )}
        </React.Fragment>
    );
};

TrainingAssessment.propTypes = {
    session_id: PropTypes.number
};
export default TrainingAssessment;
