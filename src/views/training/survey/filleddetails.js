import { useState } from 'react';
import { Grid, Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup, CircularProgress, useTheme, Button } from '@mui/material';
import { useLocation } from 'react-router';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import SurveyHeader from 'views/evaluations/survey/components/surveyHeader';

const FilledDetails = () => {
    const { t } = useTranslation();
    const { state } = useLocation();
    const theme = useTheme();
    const userResponses = JSON.parse(state.response);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [questions, setQuestions] = useState([]);

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

    //check if the given question option is checked and return boolean value
    const handleChecked = (qid, oid) => {
        var checked = false;

        const givenAnswerIndex = userResponses.findIndex((ans) => ans.qid === qid);
        if (givenAnswerIndex !== -1) {
            const options = userResponses[givenAnswerIndex];
            const checkexistance = options.answers.findIndex((answer) => answer.oid === oid);

            if (checkexistance !== -1) {
                checked = true;
            }
        }
        return checked;
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
                    <SurveyHeader back={true} name={t(data.title)} description={t(data.description)} />

                    {questions.map((question, index) => {
                        const giveAnswer = userResponses.find((ans) => ans.qid === question.id);

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
                                        <Box paddingY={1.6}>
                                            <Typography variant="subtitle2" color="secondary">
                                                {t('Answer')} {`->`} {t('checked')}
                                            </Typography>

                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {question.surveyoptions.map((option, index) => (
                                                    <FormControlLabel
                                                        key={option.id}
                                                        control={
                                                            <Checkbox
                                                                color="primary"
                                                                checked={handleChecked(question.id, option.id)}
                                                                onChange={() => {}}
                                                            />
                                                        }
                                                        label={option.option_text}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    ) : question.question_type === 'fill' ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                marginTop: 1,
                                                backgroundColor: theme.palette.secondary.light,
                                                padding: 2,
                                                borderRadius: 2
                                            }}
                                        >
                                            <Typography variant="subtitle2" color="secondary">
                                                {t('Answer')}
                                            </Typography>
                                            <Typography variant="body2" marginLeft={1.6}>
                                                {giveAnswer && giveAnswer.answers[0].text_ans}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        question.surveyoptions && (
                                            <Box paddingY={1.6}>
                                                <Typography variant="subtitle2" color="secondary">
                                                    {t('Answer')} {`->`} {t('checked')}
                                                </Typography>

                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <RadioGroup
                                                        aria-label="selection"
                                                        name="selection"
                                                        value={giveAnswer ? giveAnswer.answers[0].oid : ''}
                                                        onChange={(e) => {}}
                                                    >
                                                        {question.surveyoptions.map((option) => (
                                                            <FormControlLabel
                                                                value={option.id}
                                                                control={<Radio />}
                                                                label={t(option.option_text)}
                                                            />
                                                        ))}
                                                    </RadioGroup>
                                                </Box>
                                            </Box>
                                        )
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ marginLeft: 0.8, paddingX: 4, marginTop: 2 }}
                        onClick={() => window.print()}
                    >
                        {t('Print')}
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};

export default FilledDetails;
