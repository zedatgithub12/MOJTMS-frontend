import Adminpaths from 'routes/path/admin';
import Coordinatorpaths from 'routes/path/coordinator';
import Traineepaths from 'routes/path/trainee';

const CheckPathPermission = (path) => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const role = user.user.role;

    if (role === 'Admin') {
        const isAllowedPath = Adminpaths.includes(path);
        return isAllowedPath;
    }
    if (role === 'Coordinator') {
        const isAllowedPath = Coordinatorpaths.includes(path);
        return isAllowedPath;
    }
    if (role === 'Trainee') {
        const isAllowedPath = Traineepaths.includes(path);
        return isAllowedPath;
    }
};

export default CheckPathPermission;
