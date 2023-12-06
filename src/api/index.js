const Connections = {
    //local endpoints

    api: 'http://localhost:8000/api/',
    images: 'http://localhost:8000/api/images/',
    thumbnails: 'http://localhost:8000/api/thumbnails/',
    profiles: 'http://localhost:8000/api/profiles/',

    //remote endpoints

    // api: 'https://tms.afrominadigitals.com/backend/api/',
    // images: 'https://tms.afrominadigitals.com/backend/api/images/',
    // thumbnails: 'https://tms.afrominadigitals.com/backend/api/thumbnails/',
    // profiles: 'https://tms.afrominadigitals.com/backend/api/profiles/',

    signin: 'signin',
    forgotpassword: 'forgotpassword',
    resetpassword: 'resetpassword',
    refresh_token: 'refresh-token',

    // users management api endpoints
    users: 'users',
    searchuser: 'search-user',
    rolebasedsearch: 'role-based-search',
    changerole: 'change-role',
    updatestatus: 'update-status',

    // trainees api endpoints
    trainee: 'trainees',
    searchtrainee: 'trainee/search',
    traineestatus: 'trainee-status',
    traineename: 'trainee/name',
    updateProfile: 'trainee/profile/',

    //departments api endpoints
    departments: 'departments',
    getusers: 'get-users',
    searchdepartment: 'department/search',
    assigncoordinator: 'department/assign-coordinator',

    //trainers api endpoints
    trainers: 'trainers',
    trainersearch: 'trainer/search',

    //training api endpoints
    round: 'training/round/',
    trainingsession: 'training-sessions',
    sessions: 'training/sessions/',
    sessionStatus: 'session/status/',
    schedules: 'session-schedules',
    roundschedule: 'round-schedules/',
    trainingtrainers: 'training-trainers', //an api end point to perform create, updatestatus and delete record
    trainersofsession: 'training-trainers/session/', //an api end point to fetch a trainers assigned to specific session
    sessionoftrainers: 'training-trainers/trainers/', //an api end point to fetch a session trainer assign to

    traineeenrollments: 'trainee-enrollments',
    sessionenrollments: 'trainee-enrollments/session/',
    trainingenrollments: 'trainee-enrollments/training/',
    enrollmentstatus: 'trainee-enrollments/status/',

    trainingassessment: 'training-assessments',
    sessionassessment: 'training-assessments/session/',

    traineeassessment: 'trainee-assessments',

    trainingsurvey: 'training-surveys',
    sessionsurvey: 'training-surveys/session/',

    trainingfacilitators: 'facilitators',
    sessionfacilitators: 'facilitators/session/',

    trainingresources: 'training-resources',
    sessionresources: 'training-resources/session/',

    traineereview: 'trainee-reviews',
    trainingreview: 'trainee-reviews/training/',
    sessionreview: 'trainee-reviews/session/',

    //training api endpoints
    trainings: 'trainings',
    trainingsearch: 'training/search',

    //categories api endpoints
    categories: 'categories',
    categorsearch: 'category/search',

    //modules api endpoints
    modules: 'modules',
    modulesearch: 'module/search/',
    modulestatus: 'module/status/',
    trainingModules: 'training/modules/',

    //material api endpoints
    materials: 'materials',
    modulematerials: 'module/materials/',
    allmaterials: 'training/module/materials/',
    materialsearch: 'material/search',
    materialstatus: 'material/status/',
    materialdownload: 'material/download',

    //assassement, question and option api endpoints
    assessments: 'assessments',
    assessmentStatus: 'assessment/status/',
    assessmentSearch: 'assessment/search',
    questions: 'questions',
    options: 'question-options',

    //survey, survey question and survey option api endpoints
    surveys: 'surveys',
    surveysearch: 'survey/search',
    surveyStatus: 'survey/status/',
    surveyquestions: 'survey-questions',
    surveyoptions: 'survey-options',
    surveyresponse: 'survey-responses'
};

export default Connections;
