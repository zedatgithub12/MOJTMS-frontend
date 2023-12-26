// assets
import {
    IconDashboard,
    IconHome,
    IconBuildingStore,
    IconUsers,
    IconClipboardList,
    IconBuilding,
    IconSchool,
    IconUser,
    IconUserSearch,
    IconTestPipe,
    IconAffiliate
} from '@tabler/icons';

// constant
const icons = {
    IconDashboard,
    IconBuildingStore,
    IconUsers,
    IconHome,
    IconClipboardList,
    IconBuilding,
    IconSchool,
    IconUser,
    IconUserSearch,
    IconTestPipe,
    IconAffiliate
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const getUserRole = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    return user?.user ? user.user.role : 'Coordinator';
};

const getDashboardItems = (role) => {
    const adminTabs = [
        {
            id: 'default',
            title: 'Home',
            type: 'item',
            url: '/',
            icon: icons.IconHome,
            breadcrumbs: false
        },

        {
            id: 'departments',
            title: 'Departments',
            type: 'item',
            url: '/departments',
            icon: icons.IconBuilding,
            breadcrumbs: false
        },
        {
            id: 'coordinators',
            title: 'Coordinators',
            type: 'item',
            url: '/coordinators',
            icon: icons.IconAffiliate,
            breadcrumbs: false
        },
        {
            id: 'trainings',
            title: 'Training',
            type: 'collapse',
            url: '/sample-page',
            icon: icons.IconSchool,
            breadcrumbs: false,
            children: [
                {
                    id: 'trainings',
                    title: 'Trainings',
                    url: '/trainings',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'trainers',
                    title: 'Trainers',
                    url: '/trainers',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'training_trainees',
                    title: 'Trainees',
                    url: '/training/trainees',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'categories',
                    title: 'Categories',
                    url: '/categories',
                    type: 'item',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'trainees',
            title: 'Trainee Accounts',
            type: 'item',
            url: '/trainees',
            icon: icons.IconUsers,
            breadcrumbs: false
        },

        {
            id: 'evaluations',
            title: 'Evaluations',
            type: 'collapse',
            url: '/sample-page',
            icon: icons.IconTestPipe,
            breadcrumbs: false,
            children: [
                {
                    id: 'assessements',
                    title: 'Assessments',
                    url: '/assessments',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'surveys',
                    title: 'Surveys',
                    url: '/survey',
                    type: 'item',
                    breadcrumbs: false
                }
            ]
        },

        {
            id: 'users',
            title: 'User Management',
            type: 'item',
            url: '/users',
            icon: icons.IconUserSearch,
            breadcrumbs: false
        }
    ];

    const coordinatorTabs = [
        {
            id: 'default',
            title: 'Home',
            type: 'item',
            url: '/',
            icon: icons.IconHome,
            breadcrumbs: false
        },

        {
            id: 'trainings',
            title: 'Training',
            type: 'collapse',
            url: '/sample-page',
            icon: icons.IconSchool,
            breadcrumbs: false,
            children: [
                {
                    id: 'trainings',
                    title: 'Trainings',
                    url: '/trainings',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'trainers',
                    title: 'Trainers',
                    url: '/trainers',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'training_trainees',
                    title: 'Trainees',
                    url: '/training/trainees',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'categories',
                    title: 'Categories',
                    url: '/categories',
                    type: 'item',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'trainees',
            title: 'Trainee Accounts',
            type: 'item',
            url: '/trainees',
            icon: icons.IconUsers,
            breadcrumbs: false
        },

        {
            id: 'evaluations',
            title: 'Evaluations',
            type: 'collapse',
            url: '/assessments',
            icon: icons.IconTestPipe,
            breadcrumbs: false,
            children: [
                {
                    id: 'assessements',
                    title: 'Assessments',
                    url: '/assessments',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'surveys',
                    title: 'Surveys',
                    url: '/survey',
                    type: 'item',
                    breadcrumbs: false
                }
            ]
        }
    ];

    return role === 'Admin' ? adminTabs : coordinatorTabs;
};

const dashboard = {
    id: 'dashboard',
    type: 'group',
    children: getDashboardItems(getUserRole())
};

export default dashboard;
