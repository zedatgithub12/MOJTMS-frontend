const Connections = {
    api: 'http://localhost:8000/api/',
    images: 'http://localhost:8000/api/images/',
    thumbnails: 'http://localhost:8000/api/thumbnails/',
    profiles: 'http://localhost:8000/api/profiles/',

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
    trainee: 'trainee',
    searchtrainee: 'search-trainee',
    traineestatus: 'trainee-status',

    //departments api endpoints
    departments: 'departments',
    getusers: 'get-users',
    searchdepartment: 'department/search',
    assigncoordinator: 'department/assign-coordinator',

    //trainers api endpoints
    trainers: 'trainers'
};

export default Connections;
