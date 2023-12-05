// action - customization reducer
export const SET_MENU = '@customization/SET_MENU';
export const MENU_TOGGLE = '@customization/MENU_TOGGLE';
export const MENU_OPEN = '@customization/MENU_OPEN';
export const SET_FONT_FAMILY = '@customization/SET_FONT_FAMILY';
export const SET_BORDER_RADIUS = '@customization/SET_BORDER_RADIUS';

export const SET_ASSESSMENT_ANSWERS = 'SET_ASSESSMENT_ANSWERS';
export const SET_SURVEY_RESPONSE = 'SET_SURVEY_RESPONSE';

export const setAssessmentAnswers = (answer) => ({
    type: SET_ASSESSMENT_ANSWERS,
    payload: answer
});

export const setSurveyResponses = (response) => ({
    type: SET_SURVEY_RESPONSE,
    payload: response
});
