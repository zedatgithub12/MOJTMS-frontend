import { useState } from 'react';
import {
    Grid,
    Box,
    useTheme,
    MenuItem,
    ListItemIcon,
    Divider,
    Typography,
    Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    IconButton
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { TimeFormatter } from 'utils/functions';
import { IconArchive, IconArchiveOff, IconEdit, IconPlus, IconTrash } from '@tabler/icons';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { Delete } from 'ui-component/delete/Delete';
import { useTranslation } from 'react-i18next';
import ViewHeader from './components/viewHeader';
import Connections from 'api';
import CreateQuestion from './components/createQuestion';
import CreateOptions from './components/createOptions';

const ViewAssessement = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [data, setData] = useState([]);
    const [publishing, setPublishing] = useState('init');
    const [questions, setQuestions] = useState([]);
    const [addQuestion, setAddQuestion] = useState(false);
    const [display, setDisplay] = useState('question');
    const [creatingQuestion, setCreatingQuestion] = useState(false);
    const [QuestionInfo, setQuestionInfo] = useState([]);
    const [addingOption, setAddingOption] = useState(false);

    const [selectedQuestion, setSelectedQuestion] = useState();
    const [deleteQue, setDeleteQue] = useState(false);
    const [deleting, setDeleting] = useState(false);

    //handle data fetching
    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            setRefreshed(true);
            fetchAssessments();
        } else {
            fetchAssessments();
        }
    };

    const fetchAssessments = async () => {
        var Api = Connections.api + Connections.assessments + '/' + state.id;
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
        }
    };

    useQuery(['data'], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    // Handle assessment status change  here
    const handleAssessmentStatus = (newStatus) => {
        setPublishing('processing');
        const Api = Connections.api + Connections.assessmentStatus + state.id;
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
                    handlePrompts(response.message, 'success');
                    setPublishing('done');
                } else {
                    handlePrompts(response.message, 'error');
                    setPublishing('init');
                }
            })
            .catch((error) => {
                handlePrompts(error, 'error');
                setPublishing('init');
            });
    };

    //handle question creation
    const handleCreatingQuestion = (values) => {
        // Handle form submission here
        setCreatingQuestion(true);
        const Api = Connections.api + Connections.questions;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token
        };

        const data = new FormData();

        data.append('assessment_id', state.id);
        data.append('question_text', values.question);
        data.append('question_type', values.question_type);

        fetch(Api, { method: 'POST', headers: headers, body: data })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setCreatingQuestion(false);
                    setQuestionInfo(response.data);
                    setDisplay('option');
                    handlePrompts(response.message, 'success');
                } else {
                    setCreatingQuestion(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setCreatingQuestion(false);
                handlePrompts(error, 'error');
            });
    };

    // handle option creation
    const handleOptionSubmission = (choices) => {
        setAddingOption(true);
        const Api = Connections.api + Connections.options;
        const token = sessionStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer' + token,
            'Content-Type': 'application/json'
        };

        fetch(Api, { method: 'POST', headers: headers, body: JSON.stringify(choices) })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setAddingOption(false);
                    setDisplay('question');
                    fetchAssessments();
                    handlePrompts(response.message, 'success');
                } else {
                    setAddingOption(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setAddingOption(false);
                handlePrompts(error, 'error');
            });
    };

    //initiate question deletion
    const handleDeleteInitiation = (question) => {
        setSelectedQuestion(question);
        setDeleteQue(true);
    };

    //the following function handles delete question functionality
    const DeleteQuestion = (que_Id) => {
        setDeleting(true);

        var Api = Connections.api + Connections.questions + '/' + que_Id;
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
                    setDeleteQue(false);
                    fetchAssessments();
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
                <ViewHeader
                    back={true}
                    name={state.assessment_name}
                    description={state.assessment_description}
                    score={state.passing_score}
                    duration={TimeFormatter(state.duration)}
                    instruction={state.instructions}
                    option={true}
                    status={state.status}
                    onPublish={() => handleAssessmentStatus('active')}
                    publishing={publishing}
                    sx={{}}
                    optionChildrens={
                        <Box>
                            <MenuItem onClick={() => setAddQuestion(!addQuestion)}>
                                <ListItemIcon>
                                    <IconPlus size={18} />
                                </ListItemIcon>
                                {t('Create Question')}
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => navigate('/assessment/update', { state: state })}>
                                <ListItemIcon>
                                    <IconEdit size={18} />
                                </ListItemIcon>
                                {t('Update')}
                            </MenuItem>
                            <Divider />
                            {state.status === 'active' && (
                                <MenuItem onClick={() => handleAssessmentStatus('archived')}>
                                    <ListItemIcon>
                                        <IconArchive size={18} />
                                    </ListItemIcon>
                                    {t('Archive')}
                                </MenuItem>
                            )}

                            {state.status === 'archived' && (
                                <MenuItem onClick={() => handleAssessmentStatus('active')}>
                                    <ListItemIcon>
                                        <IconArchiveOff size={18} />
                                    </ListItemIcon>
                                    {t('Un archive')}
                                </MenuItem>
                            )}
                        </Box>
                    }
                />
                {addQuestion && (
                    <Box
                        sx={{
                            border: 2,
                            borderColor: theme.palette.primary[200],
                            backgroundColor: theme.palette.primary.light,
                            borderRadius: 2,
                            paddingY: 1.6,
                            paddingX: 2.2,
                            marginTop: 1.6
                        }}
                    >
                        {display === 'option' ? (
                            <CreateOptions question={QuestionInfo} handleSubmission={handleOptionSubmission} isSubmitting={addingOption} />
                        ) : (
                            <CreateQuestion
                                isSubmitting={creatingQuestion}
                                handleSubmission={handleCreatingQuestion}
                                handleClose={() => setAddQuestion(false)}
                            />
                        )}
                    </Box>
                )}

                {questions.map((question, index) => (
                    <Box key={question.id} sx={{ marginTop: 6, paddingX: 1 }}>
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
                                <Typography variant="subtitle1">{(index += 1)}.</Typography>
                                <Typography variant="subtitle1" marginLeft={1.6}>
                                    {t(question.question_text)}
                                </Typography>
                            </Box>

                            <IconButton onClick={() => handleDeleteInitiation(question.id)}>
                                <IconTrash size={18} color={theme.palette.error.main} />
                            </IconButton>
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
                                              control={<Checkbox checked={option.is_correct} color="primary" />}
                                              label={t(option.option_text)}
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
                                          <RadioGroup aria-label="selection" name="selection">
                                              {question.options.map((option) => (
                                                  <FormControlLabel
                                                      value={option.option_text}
                                                      control={<Radio />}
                                                      checked={parseInt(option.is_correct)}
                                                      label={t(option.option_text)}
                                                  />
                                              ))}
                                          </RadioGroup>
                                      </Box>
                                  )}
                        </Box>
                    </Box>
                ))}
            </Grid>

            {deleteQue && (
                <Delete
                    type="Delete"
                    open={deleteQue}
                    title="Deleting Question"
                    description={`Are you sure you want to delete the question`}
                    onNo={() => setDeleteQue(false)}
                    onYes={() => DeleteQuestion(selectedQuestion)}
                    deleting={deleting}
                    handleClose={() => setDeleteQue(false)}
                />
            )}

            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default ViewAssessement;
