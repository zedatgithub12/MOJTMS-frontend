import React, { useState } from 'react';
import { Button, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { Box } from '@mui/system';
import { IconPlus } from '@tabler/icons';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import PropTypes from 'prop-types';
import SurveyListing from './components/Listing';

const TrainingSurvey = ({ session_id }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));

    const [data, setData] = useState([]);
    const [allSurvey, setAllSurvey] = useState([]);
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
            FetchSurveys();
        } else {
            FetchSurveys();
        }
    };

    const FetchSurveys = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.sessionsurvey + session_id;
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
            const surveys = parsed.surveys;
            setData(data);
            setAllSurvey(surveys);
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    const handleSurveySelection = () => {
        if (selected.status) {
            setSelected({ ...selected, status: false, type: '' });
        } else {
            setSelected({ ...selected, status: true, type: 'added' });
        }
    };

    //handle the survey addition to a training session
    const handleSurveyAddition = (survey) => {
        setAssigning(true);

        const Api = Connections.api + Connections.trainingsurvey;
        const token = sessionStorage.getItem('token');

        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        var assigned_by = ActiveUser.user.id;

        const data = {
            session_id: session_id,
            survey_id: survey.id,
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
                    FetchSurveys(); //fetch the updated survey from database
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

    //the following function handles remove selected surveys
    const handleRemoving = (recordid) => {
        setRemoving(true);

        var Api = Connections.api + Connections.trainingsurvey + '/' + recordid;
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
                    FetchSurveys();
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
        enqueueSnackbar(message, { variant });
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
                            {data.length > 0 && (
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        backgroundColor: theme.palette.primary[200],
                                        padding: 1,
                                        margin: 1,
                                        borderRadius: 2
                                    }}
                                >
                                    {data.map((survey) => (
                                        <SurveyListing
                                            key={survey.id}
                                            name={survey.title}
                                            question={survey.question_count}
                                            actionButton={
                                                <Button
                                                    variant="text"
                                                    color="primary"
                                                    disabled={removing}
                                                    onClick={() => handleRemoving(survey.id)}
                                                >
                                                    {t('Remove')}
                                                </Button>
                                            }
                                        />
                                    ))}
                                </Grid>
                            )}

                            <Grid
                                item
                                xs={12}
                                sx={{
                                    backgroundColor: theme.palette.primary[200],
                                    padding: 1,
                                    margin: 1,
                                    borderRadius: 2,
                                    border: selected.status && selected.type === 'added' ? 2 : 0,
                                    borderColor: theme.palette.primary.main,
                                    cursor: 'pointer'
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 1
                                    }}
                                    onClick={() => handleSurveySelection()}
                                >
                                    <IconPlus size={24} />
                                    <Typography variant="subtitle1" marginLeft={2}>
                                        {t('Add Survey')}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item xs={12} marginTop={0.4} padding={1}>
                            {allSurvey &&
                                allSurvey.map((item) => (
                                    <SurveyListing
                                        key={item.id}
                                        name={item.title}
                                        question={item.question_count}
                                        actionButton={
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                disabled={!selected.status || assigning ? true : false}
                                                onClick={() => handleSurveyAddition(item)}
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

TrainingSurvey.propTypes = {
    session_id: PropTypes.number
};
export default TrainingSurvey;
