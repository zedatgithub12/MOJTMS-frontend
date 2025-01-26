import { CircularProgress, Dialog, Box, Grid, IconButton, Typography, useMediaQuery, useTheme, DialogActions, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshToken } from 'utils/token-refresh';
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { useQuery } from 'react-query';
import Connections from 'api';
import noresult from 'assets/images/no_result.png';
import { IconCheck, IconX } from '@tabler/icons';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

const AddTrainerSurvey = ({ open, handleClose, trainer_id, session_id, onRefresh }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const smallDevice = useMediaQuery(theme.breakpoints.down('md'));

    const [loading, setLoading] = useState(false);
    const [surveys, setSurveys] = useState([]);
    const [selected, setSelected] = useState(false);
    const [selectedSurveyID, setSlectedSurveyID] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchTrainerSurveys();
        } else {
            FetchTrainerSurveys();
        }
    };

    const FetchTrainerSurveys = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.trainersurveys;
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
            setSurveys(data);
            setLoading(false);
        }
    };

    const { error } = useQuery(['data'], () => handleFetching(), {
        refetchOnWindowFocus: false
    });

    //here the handle selection method will be fired whenever the item got selected or unselected
    const handleSelection = (id) => {
        if (selectedSurveyID === id) {
            setSelected(false);
            setSlectedSurveyID(null);
        } else {
            setSelected(true);
            setSlectedSurveyID(id);
        }
    };

    //handle the survey addition to a training session
    const handleSubmitting = () => {
        setSubmitting(true);

        const userString = sessionStorage.getItem('user');
        const user = JSON.parse(userString);
        const added_by = user.user.id;

        const Api = Connections.api + Connections.trainersurveys;
        const token = sessionStorage.getItem('token');

        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        const data = {
            trainer_id: trainer_id,
            session_id: session_id,
            survey_id: selectedSurveyID,
            added_by: added_by
        };

        fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setSubmitting(false);
                    handlePrompts(response.message, 'success');
                    onRefresh();
                } else {
                    setSubmitting(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setSubmitting(false);
                handlePrompts(error, 'error');
            });
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(t(message), { variant });
    };
    return (
        <Dialog open={open} onClose={handleClose}>
            <Grid container>
                <Grid item sx={{ minWidth: smallDevice ? '290px' : '600px', minHeight: '400px' }}>
                    <Grid
                        container
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingY: 1,
                            paddingX: 2,
                            backgroundColor: theme.palette.primary.main
                        }}
                    >
                        <Grid item xs={10} paddingLeft={2}>
                            <Typography variant="h4" color={theme.palette.background.default}>
                                {t('Add Trainer Survey')}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton onClick={handleClose}>
                                <IconX size={24} style={{ color: theme.palette.background.default }} />
                            </IconButton>
                        </Grid>
                    </Grid>

                    {loading ? (
                        <Grid
                            container
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 8
                            }}
                        >
                            <CircularProgress size={22} />
                        </Grid>
                    ) : error ? (
                        <ErrorPrompt image={noresult} title="Server Error" message="Oooops... unable to retrive the trainer surveys!" />
                    ) : surveys.length === 0 ? (
                        <NoResult title="" message="Oooops... No trainer survey found!" />
                    ) : (
                        <Grid container>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 2
                                }}
                            >
                                {surveys.map((survey, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            width: '92%',
                                            marginTop: 1,
                                            padding: 2,
                                            border: 1,
                                            borderRadius: 2,
                                            borderColor:
                                                selected && selectedSurveyID === survey.id
                                                    ? theme.palette.primary.main
                                                    : theme.palette.grey[200],
                                            backgroundColor: theme.palette.primary[200],
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                        onClick={() => handleSelection(survey.id)}
                                    >
                                        <Typography variant="body1" color="primary">
                                            {survey.title}
                                        </Typography>
                                        {selected && selectedSurveyID === survey.id && <IconCheck size={18} />}
                                    </Box>
                                ))}
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Grid>

            <DialogActions sx={{ padding: 2, paddingX: 3.4 }}>
                <Button onClick={handleClose} color="dark">
                    {t('Close')}
                </Button>

                <Button
                    onClick={() => handleSubmitting()}
                    variant="contained"
                    color="primary"
                    disabled={selected && selectedSurveyID ? false : true}
                    sx={{ paddingX: 4, marginLeft: 2 }}
                >
                    {submitting ? <CircularProgress size={16} sx={{ color: theme.palette.background.default }} /> : t('Submit')}
                </Button>
            </DialogActions>
            <SnackbarProvider maxSnack={3} />
        </Dialog>
    );
};

export default AddTrainerSurvey;
