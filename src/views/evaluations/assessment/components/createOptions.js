import {
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Radio,
    RadioGroup,
    Typography,
    useTheme
} from '@mui/material';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IconCheck } from '@tabler/icons';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
    option: Yup.string().max(300)
});

const CreateOptions = ({ question, handleSubmission, isSubmitting }) => {
    const theme = useTheme();

    const options = []; //an array the contains a question options
    const [truefalse, setTrueFalse] = useState([
        { question_id: question.id, option_text: 'True', is_correct: false },
        { question_id: question.id, option_text: 'False', is_correct: false }
    ]); //an array the contains a question options for true or false question types
    const [selection, setSelection] = useState('');
    const [answered, setAnswered] = useState(false);

    const handleSelectionChange = (event) => {
        const updatedArray = truefalse.map((item) => {
            if (item.option_text === event.target.value) {
                return { ...item, is_correct: true };
            }
            setAnswered(true);
            return { ...item, is_correct: false };
        });

        setTrueFalse(updatedArray);
        setSelection(event.target.value);
    };

    const hasAnswer = (option) => {
        return option.some((item) => item.is_correct === true);
    };

    const handleCheckboxChange = (event) => {
        console.log('checked');
    };

    const handleOptionAddition = (formik, question) => {
        const newOption = {
            question_id: question.id,
            option_text: formik.values.option,
            is_correct: false
        };
        options.push(newOption);
    };

    //submit the question to be added
    const handleSubmitting = () => {
        // Handle form submission here
        const theOption = question.question_type === 'true/false' ? truefalse : options;
        if (hasAnswer(theOption)) {
            handleSubmission(theOption);
        }
    };

    const formik = useFormik({
        initialValues: { option: '' },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmitting(values);
        }
    });

    return (
        <Box>
            <Typography variant="h4">{question.question_text}</Typography>
            <Divider />
            <Box sx={{ paddingTop: 1, marginY: 1.6 }}>
                <Typography variant="subtitle1">Options</Typography>

                {question.question_type === 'true/false' ? (
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="selection" name="selection" value={selection} onChange={handleSelectionChange}>
                            {truefalse.map((option) => (
                                <FormControlLabel value={option.option_text} control={<Radio />} label={option.option_text} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                ) : question.question_type === 'multiple-choice' ? (
                    <Box>
                        {options.map((option) => (
                            <FormControlLabel
                                key={option.id}
                                control={<Checkbox checked={option.is_correct} onChange={handleCheckboxChange} color="primary" />}
                                label={option.question_text}
                            />
                        ))}
                    </Box>
                ) : (
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="selection" name="selection" value={selection} onChange={handleSelectionChange}>
                            {options.map((option) => (
                                <FormControlLabel value={option.option_text} control={<Radio />} label={option.option_text} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                )}
            </Box>

            <form noValidate onSubmit={formik.handleSubmit}>
                {question.question_type !== 'true/false' && (
                    <FormControl
                        fullWidth
                        error={formik.touched.option && Boolean(formik.errors.option)}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <InputLabel htmlFor="option">Add option</InputLabel>
                        <OutlinedInput
                            id="option"
                            name="option"
                            label="Add option"
                            value={formik.values.option}
                            onChange={formik.handleChange}
                            fullWidth
                            inputProps={{}}
                            multiline
                            endAdornment={
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ marginRight: 1 }}
                                    onClick={() => handleOptionAddition(formik, question)}
                                >
                                    <IconCheck size={18} />
                                </Button>
                            }
                        />
                        {formik.touched.option && formik.errors.option && (
                            <FormHelperText error id="standard-weight-helper-text-option">
                                {formik.errors.option}
                            </FormHelperText>
                        )}
                    </FormControl>
                )}

                <Button
                    disabled={!answered || isSubmitting ? true : false}
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 120, py: 1, px: 4, my: 2 }}
                >
                    {isSubmitting ? <CircularProgress size={22} sx={{ color: theme.palette.background.default }} /> : 'Done'}
                </Button>
            </form>
        </Box>
    );
};

CreateOptions.propTypes = {
    question: PropTypes.array
};

export default CreateOptions;
