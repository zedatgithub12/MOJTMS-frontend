import { useState } from 'react';
import { Grid, Box, Typography, Button, FormControlLabel, Radio, RadioGroup, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setSurveyResponses } from 'store/actions';
import { RefreshToken } from 'utils/token-refresh';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import TakenDialog from './components/takendialog';
import SurveyHeader from './components/surveyHeader';

const TrainerSurvey = () => {
    const { t } = useTranslation();
    const { state } = useLocation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const surveyresponse = useSelector((state) => state.customization.surveyresponse); // an array of response stored in redux state

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [succeed, setSucceed] = useState(false);

    //handle data fetching
    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            fetchsurveys();
        } else {
            fetchsurveys();
        }
    };

    const fetchsurveys = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.surveys + '/' + state.survey_id;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const data = parsed.data.survey;
            const question = parsed.data.questions;

            setData(data);
            setQuestions(question);
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    //handle a single selection change here
    const handleRadioSelection = (e, que) => {
        const selectedQuestion = questions.find((item) => item.id === que.id);
        const questionoptions = selectedQuestion?.surveyoptions;

        const selectedOption = questionoptions.findIndex((option) => option.id == e.target.value);
        const option = questionoptions[selectedOption];

        handleSingleSelect({
            survey_id: que.survey_id,
            survey_question_id: que.id,
            survey_option_id: option.id
        });
    };

    //handle the selection of answer in each question
    const handleSingleSelect = (answer) => {
        // answer is will be an new answer selected and it will be referencing to answer paramer, the answer parameter is an object containing, qid, oid, and isCorrect attributes
        const existingAnswerIndex = surveyresponse.findIndex((ans) => ans.survey_question_id === answer.survey_question_id); //return the existing answer index if exist

        const updatedAnswers = [...surveyresponse];

        if (existingAnswerIndex !== -1) {
            //if the answers exist
            const existingAnswer = surveyresponse[existingAnswerIndex];
            if (JSON.stringify(existingAnswer).survey_question_id === JSON.stringify(answer).survey_question_id) {
                const updatedAnswers = [...surveyresponse];

                updatedAnswers.splice(existingAnswerIndex, 1);
                updatedAnswers.push(answer);
                dispatch(setSurveyResponses(updatedAnswers));
                return;
            }
        } else {
            updatedAnswers.push(answer);
            dispatch(setSurveyResponses(updatedAnswers));
        }
    };

    //handle answer submission here
    const handleAnsSubmission = () => {
        let questioncount = questions.length;
        let answeredcount = surveyresponse.length;

        if (answeredcount < questioncount) {
            handlePrompts('Please answer all questions before submitting', 'info');
        } else {
            setIsSubmitting(true);
            const Api = Connections.api + Connections.trainerreview;
            const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
            const Addedby = ActiveUser.user.id;
            const token = sessionStorage.getItem('token');
            const headers = {
                Authorization: 'Bearer' + token,
                'Content-Type': 'application/json'
            };

            const thissurveyanswers = surveyresponse.filter((item) => item.survey_id === state.survey_id);
            const answerstring = JSON.stringify(thissurveyanswers);
            const data = {
                trainer_id: state.trainer_id,
                session_id: state.session_id,
                survey_id: state.survey_id,
                user_id: Addedby,
                reviews: answerstring
            };

            fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setSucceed(true);
                        setIsSubmitting(false);
                    } else {
                        setIsSubmitting(false);
                        handlePrompts(response.message, 'error');
                    }
                })
                .catch((error) => {
                    setIsSubmitting(false);
                    handlePrompts(error, 'error');
                });
        }
    };

    //the following function will be triggered when user clicked done button
    // after taking the assessment
    const AssessmentDone = () => {
        setSucceed(false);
        dispatch(setSurveyResponses([]));
        navigate(-1);
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(t(message), { variant });
    };

    return (
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
            }}
        >
            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 3
                    }}
                >
                    <CircularProgress size={22} />
                </Box>
            ) : (
                <Grid
                    item
                    xs={11}
                    sm={10}
                    md={10}
                    lg={8}
                    xl={8}
                    sx={{
                        marginBottom: 2,
                        minHeight: '90vh'
                    }}
                >
                    <SurveyHeader back={true} name={data.title} description={data.description} />

                    {questions.map((question, index) => {
                        const existingAnswer = surveyresponse.find((ans) => ans.survey_question_id === question.id);

                        return (
                            <Box key={index} sx={{ marginTop: 6, paddingX: 1 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography variant="h4">{(index += 1)}.</Typography>
                                        <Typography variant="subtitle1" marginLeft={1.6}>
                                            {t(question.question_text)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box>
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 1
                                        }}
                                    >
                                        <RadioGroup
                                            aria-label="selection"
                                            name="selection"
                                            value={existingAnswer ? existingAnswer.survey_option_id : ''}
                                            onChange={(e) => handleRadioSelection(e, question)}
                                        >
                                            {question.surveyoptions.map((option, index) => (
                                                <FormControlLabel
                                                    key={index}
                                                    value={option.id}
                                                    control={<Radio />}
                                                    label={t(option.option_text)}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}

                    <Grid container>
                        <Grid item xs={12} marginTop={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    padding: 1.4,
                                    paddingX: 8
                                }}
                                onClick={() => handleAnsSubmission()}
                                disabled={isSubmitting}
                            >
                                {t('Submit')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            )}

            {/* the dialog to prompt that the survey is filled successfully */}

            {succeed && <TakenDialog open={succeed} handleClose={() => AssessmentDone()} onDone={() => AssessmentDone()} />}

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default TrainerSurvey;
