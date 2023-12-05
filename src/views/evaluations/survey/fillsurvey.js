import { useState } from 'react';
import {
    Grid,
    Box,
    Typography,
    Button,
    Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    CircularProgress,
    OutlinedInput,
    FormControl
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import Connections from 'api';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setSurveyResponses } from 'store/actions';
import { RefreshToken } from 'utils/token-refresh';
import TakenDialog from './components/takendialog';
import SurveyHeader from './components/surveyHeader';

const FillSurvey = () => {
    const { state } = useLocation();
    // const theme = useTheme();
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
        const questionoptions = selectedQuestion.options;

        const selectedOption = questionoptions.findIndex((option) => option.id == e.target.value);
        const option = questionoptions[selectedOption];
        const isCorrect = option.is_correct == 1 ? true : false;

        handleSingleSelect(
            {
                qid: que.id,
                oid: option.id,
                iscorrect: isCorrect
            },
            option.is_correct
        );
    };

    //handle the selection of answer in each question
    const handleSingleSelect = (answer, apoint) => {
        // answer is will be an new answer selected and it will be referencing to answer paramer, the answer parameter is an object containing, qid, oid, and isCorrect attributes
        const existingAnswerIndex = surveyresponse.findIndex((ans) => ans.qid === answer.qid); //return the existing answer index if exist

        const newAnswer = {
            qid: answer.qid,
            answers: [
                {
                    oid: answer.oid,
                    is_correct: answer.iscorrect
                }
            ],
            point: apoint //by default the answered question point is one
        };

        const updatedAnswers = [...surveyresponse];

        if (existingAnswerIndex !== -1) {
            //if the answers exist
            const existingAnswer = surveyresponse[existingAnswerIndex];
            if (JSON.stringify(existingAnswer).qid === JSON.stringify(newAnswer).qid) {
                const updatedAnswers = [...surveyresponse];

                updatedAnswers.splice(existingAnswerIndex, 1);
                updatedAnswers.push(newAnswer);
                dispatch(setSurveyResponses(updatedAnswers));
                return;
            }
        } else {
            updatedAnswers.push(newAnswer);
            dispatch(setSurveyResponses(updatedAnswers));
        }
    };

    //check if the given question option is checked and return boolean value
    const handleChecked = (qid, oid) => {
        var checked = false;

        const existingAnswerIndex = surveyresponse.findIndex((ans) => ans.qid === qid);
        if (existingAnswerIndex !== -1) {
            const options = surveyresponse[existingAnswerIndex];
            const checkexistance = options.answers.findIndex((answer) => answer.oid === oid);

            if (checkexistance !== -1) {
                checked = true;
            }
        }
        return checked;
    };

    //handle multiple question select
    function handleMultiSelect({ qid, oid, iscorrect }) {
        const existingAnswerIndex = surveyresponse.findIndex((answer) => answer.qid === qid);
        const isCorrect = iscorrect === 1 ? true : false;
        const newAnswer = {
            qid: qid,
            answers: [{ oid: oid, is_correct: isCorrect }],
            point: 1
        };

        const updatedAnswers = [...surveyresponse];

        if (existingAnswerIndex !== -1) {
            const existingAnswer = surveyresponse[existingAnswerIndex];
            if (existingAnswer.qid === newAnswer.qid) {
                const existingOptionIndex = existingAnswer.answers.findIndex((answer) => answer.oid === oid);

                if (existingOptionIndex !== -1) {
                    // Remove the selected option
                    existingAnswer.answers.splice(existingOptionIndex, 1);
                } else {
                    // Add the selected option
                    existingAnswer.answers.push({ oid: oid, is_correct: isCorrect });
                }

                dispatch(setSurveyResponses(updatedAnswers));
                return;
            }
        }

        updatedAnswers.push(newAnswer);
        dispatch(setSurveyResponses(updatedAnswers));
    }

    //handle answer submission here
    const handleAnsSubmission = () => {
        let questioncount = questions.length;
        let answeredcount = surveyresponse.length;

        if (questioncount !== answeredcount) {
            handlePrompts('Please answer all questions before submitting', 'info');
        } else {
            setIsSubmitting(true);
            const Api = Connections.api + Connections.traineeassessment;
            const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
            const Addedby = ActiveUser.user.id;
            const token = sessionStorage.getItem('token');
            const headers = {
                Authorization: 'Bearer' + token,
                'Content-Type': 'application/json'
            };

            const answerstring = JSON.stringify(surveyresponse);
            const data = {
                assessment_id: state.assessment_id,
                user_id: Addedby,
                session_id: state.session_id,
                type: state.assessment_type,
                answers: answerstring,
                feedback: ''
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
        enqueueSnackbar(message, { variant });
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
                        const existingAnswer = surveyresponse.find((ans) => ans.qid === question.id);
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
                                            {question.question_text}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box>
                                    {question.question_type === 'multiple-choice' && question.surveyoptions ? (
                                        question.surveyoptions.map((option, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <FormControlLabel
                                                    key={option.id}
                                                    control={
                                                        <Checkbox
                                                            color="primary"
                                                            checked={handleChecked(question.id, option.id)}
                                                            onChange={() =>
                                                                handleMultiSelect({
                                                                    qid: question.id,
                                                                    oid: option.id,
                                                                    iscorrect: option.is_correct
                                                                })
                                                            }
                                                        />
                                                    }
                                                    label={option.option_text}
                                                />
                                            </Box>
                                        ))
                                    ) : question.question_type === 'fill' ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 1
                                            }}
                                        >
                                            <FormControl fullWidth>
                                                <OutlinedInput
                                                    id="survey-answer"
                                                    name={`answer${question.id}`}
                                                    value={''}
                                                    onChange={(event) => console.log(event.target.value, event.target.name)}
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                />
                                            </FormControl>
                                        </Box>
                                    ) : (
                                        question.surveyoptions && (
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
                                                    value={existingAnswer ? existingAnswer.answers[0].oid : ''}
                                                    onChange={(e) => handleRadioSelection(e, question)}
                                                >
                                                    {question.surveyoptions.map((option) => (
                                                        <FormControlLabel
                                                            value={option.id}
                                                            control={<Radio />}
                                                            label={option.option_text}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </Box>
                                        )
                                    )}
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
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            )}

            {/* the dialog to prompt that the survey is filled successfully */}

            {succeed && <TakenDialog open={succeed} handleClose={() => AssessmentDone()} score={'jk'} onDone={() => AssessmentDone()} />}

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default FillSurvey;
