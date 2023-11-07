const Connections = {
    api: 'http://localhost:8000/api/',
    images: 'http://localhost:8000/api/images/',
    thumbnails: 'http://localhost:8000/api/thumbnails/',

    signin: 'signin',
    forgotpassword: 'forgotpassword',
    resetpassword: 'resetpassword',
    refresh_token: 'refresh-token',

    // users management api endpoints
    users: 'users',
    searchuser: 'search-user',
    changerole: 'change-role',
    updatestatus: 'update-status',

    // trainees api endpoints
    trainee: 'trainee',
    searchtrainee: 'search-trainee',
    traineestatus: 'trainee-status',

    //departments api endpoints
    departments: 'departments',
    searchdepartment: 'department/search'
};

export default Connections;
