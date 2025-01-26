// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    isOpen: [], // for active default menu
    defaultId: 'default',
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    basicinfos: [], //an state that store the basic information needed while filtering or other purposed it contains job_title and department name list arrays
    assessmentAnswers: [],
    surveyresponse: []
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
    let id;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case actionTypes.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        case actionTypes.SET_ASSESSMENT_ANSWERS:
            return {
                ...state,
                assessmentAnswers: action.payload
            };
        case actionTypes.SET_SURVEY_RESPONSE:
            return {
                ...state,
                surveyresponse: action.payload
            };

        case actionTypes.SET_BASIC_INFOS:
            return {
                ...state,
                basicinfos: action.payload
            };

        default:
            return state;
    }
};

export default customizationReducer;
