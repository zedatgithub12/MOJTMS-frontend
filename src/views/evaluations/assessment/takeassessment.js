import { useState } from 'react';
import {
    Grid,
    Box,
    useTheme,
    Typography,
    Button,
    Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    CircularProgress,
    IconButton
} from '@mui/material';
import { IconChevronDown, IconChevronRight, IconX } from '@tabler/icons';
import { useLocation, useNavigate } from 'react-router';
import { TimeFormatter } from 'utils/functions';
import Connections from 'api';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import TestHeader from './components/testHeader';
import InfoDialog from './components/InfoDialog';
import { ReadMore } from 'utils/functions';
import { useSelector, useDispatch } from 'react-redux';
import { setAssessmentAnswers } from 'store/actions';
import { RefreshToken } from 'utils/token-refresh';

const letterConfig = {
    startfrom: 0,
    endat: 500
};

const TakeAssessment = () => {
    const { state } = useLocation();
    const theme = useTheme();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const assessmentAnswers = useSelector((state) => state.customization.assessmentAnswers); // an array of answers stored in redux state

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [teststatus, setTestStatus] = useState('not started');
    const [timeStatus, setTimeStatus] = useState('in'); // a state that captures whether the trainee completed the test in a given time or not
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [open, setOpen] = useState(true);
    const [collapse, setCollapse] = useState(true);
    const [openInstruction, setOpenInstruction] = useState(false);

    const ExpndText = () => {
        setCollapse(!collapse);
    };

    //handle data fetching
    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            fetchAssessments();
        } else {
            fetchAssessments();
        }
    };

    const fetchAssessments = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.assessments + '/' + state.assessment_id;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const data = parsed.data.assessment;
            const question = parsed.data.questions;
            setData(data);
            setQuestions(question);
            setLoading(false);
        }
    };

    useQuery(['data'], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    //handle the start of assessment
    const handleStartingAssessment = () => {
        setTestStatus('taking');
        setOpen(false);
    };

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
        const existingAnswerIndex = assessmentAnswers.findIndex((ans) => ans.qid === answer.qid); //return the existing answer index if exist

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

        const updatedAnswers = [...assessmentAnswers];

        if (existingAnswerIndex !== -1) {
            //if the answers exist
            const existingAnswer = assessmentAnswers[existingAnswerIndex];
            if (JSON.stringify(existingAnswer).qid === JSON.stringify(newAnswer).qid) {
                const updatedAnswers = [...assessmentAnswers];

                updatedAnswers.splice(existingAnswerIndex, 1);
                updatedAnswers.push(newAnswer);
                dispatch(setAssessmentAnswers(updatedAnswers));
                return;
            }
        } else {
            updatedAnswers.push(newAnswer);
            dispatch(setAssessmentAnswers(updatedAnswers));
        }
    };

    //check if the given question option is checked and return boolean value
    const handleChecked = (qid, oid) => {
        var checked = false;

        const existingAnswerIndex = assessmentAnswers.findIndex((ans) => ans.qid === qid);
        if (existingAnswerIndex !== -1) {
            const options = assessmentAnswers[existingAnswerIndex];
            const checkexistance = options.answers.findIndex((answer) => answer.oid === oid);

            if (checkexistance !== -1) {
                checked = true;
            }
        }
        return checked;
    };

    //handle multiple question select
    function handleMultiSelect({ qid, oid, iscorrect }) {
        const existingAnswerIndex = assessmentAnswers.findIndex((answer) => answer.qid === qid);
        const isCorrect = iscorrect === 1 ? true : false;
        const newAnswer = {
            qid: qid,
            answers: [{ oid: oid, is_correct: isCorrect }],
            point: 1
        };

        const updatedAnswers = [...assessmentAnswers];

        if (existingAnswerIndex !== -1) {
            const existingAnswer = assessmentAnswers[existingAnswerIndex];
            if (existingAnswer.qid === newAnswer.qid) {
                const existingOptionIndex = existingAnswer.answers.findIndex((answer) => answer.oid === oid);

                if (existingOptionIndex !== -1) {
                    // Remove the selected option
                    existingAnswer.answers.splice(existingOptionIndex, 1);
                } else {
                    // Add the selected option
                    existingAnswer.answers.push({ oid: oid, is_correct: isCorrect });
                }

                dispatch(setAssessmentAnswers(updatedAnswers));
                return;
            }
        }

        updatedAnswers.push(newAnswer);
        dispatch(setAssessmentAnswers(updatedAnswers));
    }

    //a function that check takes the status of assessment whether it is elapse or on progress
    const handleElapsed = (value) => {
        setTimeStatus(value);
    };

    //calculate the score before submitting
    function calculateScore() {
        let question = assessmentAnswers.length;
        let totalPoints = 0;

        assessmentAnswers.forEach((answer) => {
            var type = answer.answers.length;
            if (type > 1) {
                const origionaloptioncount = questions.find((item) => item.id === answer.qid);
                const numberofoptions = origionaloptioncount.options.length;
                let thecorrects = origionaloptioncount.options.filter((item) => item.is_correct == 1);
                let eachpoint = 1 / numberofoptions;

                let correct = answer.answers.filter((item) => item.is_correct === true);
                let wrong = answer.answers.filter((item) => item.is_correct === false);

                const thepoints = (correct.length -= wrong.length);

                if (thepoints > 0) {
                    var correctone;
                    if (correct.length != thecorrects.length) {
                        correctone = thepoints * eachpoint;
                        totalPoints += correctone;
                    } else {
                        totalPoints += 1;
                    }
                }
            } else {
                totalPoints += answer.point;
            }
        });

        var score = (totalPoints / question) * 100;
        return parseInt(score);
    }

    //handle answer submission here
    const handleAnsSubmission = () => {
        let questioncount = questions.length;
        let answeredcount = assessmentAnswers.length;

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

            const answerstring = JSON.stringify(assessmentAnswers);
            const data = {
                assessment_id: state.assessment_id,
                user_id: Addedby,
                session_id: state.session_id,
                type: state.assessment_type,
                answers: answerstring,
                score: calculateScore(),
                feedback: '',
                status: timeStatus
            };

            fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(data) })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        handlePrompts(response.message, 'success');
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
                    <TestHeader
                        back={true}
                        name={data.assessment_name}
                        description={data.assessment_description}
                        score={data.passing_score}
                        duration={data.duration}
                        instruction={data.instructions}
                        status={teststatus}
                        onStart={() => alert('okay i will start')}
                        onElapsed={handleElapsed}
                        isSubmitting={false}
                        sx={{}}
                        option={false}
                    />

                    {questions.map((question, index) => {
                        const existingAnswer = assessmentAnswers.find((ans) => ans.qid === question.id);
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
                                    {question.question_type === 'multiple-choice' && question.options
                                        ? question.options.map((option) => (
                                              <Box
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
                                        : question.options && (
                                              <Box
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
                                                      {question.options.map((option) => (
                                                          <FormControlLabel
                                                              value={option.id}
                                                              control={<Radio />}
                                                              label={option.option_text}
                                                          />
                                                      ))}
                                                  </RadioGroup>
                                              </Box>
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

            <InfoDialog open={open} handleClose={() => navigate(-1)}>
                <Grid container>
                    {loading ? (
                        <Grid
                            item
                            xs={12}
                            padding={2}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}
                        >
                            <CircularProgress size={22} />
                        </Grid>
                    ) : (
                        <Grid item xs={12} paddingX={4} paddingY={2}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h4">Training Assessment</Typography>
                                <IconButton onClick={() => navigate(-1)}>
                                    <IconX size={22} />
                                </IconButton>
                            </Box>
                            {data && data.assessment_description && (
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body2">
                                        {ReadMore(data.assessment_description, letterConfig.startfrom, letterConfig.endat, collapse)}
                                    </Typography>

                                    {data.assessment_description.length > letterConfig.endat && (
                                        <Typography
                                            component={'div'}
                                            onClick={() => ExpndText()}
                                            sx={{ marginTop: 1, color: theme.palette.primary.main, cursor: 'pointer' }}
                                        >
                                            {collapse ? 'Read More' : 'Read Less'}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingY: 3,
                                    marginTop: 1.6
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        padding: 1.6,
                                        paddingX: 8,
                                        borderRadius: 2
                                    }}
                                    onClick={() => handleStartingAssessment()}
                                >
                                    <Typography variant="subtitle1" color={theme.palette.background.default}>
                                        {' '}
                                        Start Assessment
                                    </Typography>
                                </Button>
                            </Box>

                            {data.instructions && (
                                <Box paddingTop={1}>
                                    <Button variant="text" color="primary" onClick={() => setOpenInstruction(!openInstruction)}>
                                        Instructions {openInstruction ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                                    </Button>

                                    {openInstruction && (
                                        <Typography variant="body2" sx={{ padding: 1 }}>
                                            {data.instructions}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Grid>
                    )}
                </Grid>
            </InfoDialog>
            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default TakeAssessment;
