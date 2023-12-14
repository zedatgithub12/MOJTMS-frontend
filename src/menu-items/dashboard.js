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
    IconTestPipe
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
    IconTestPipe
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: '',
    type: 'group',
    children: [
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
            id: 'trainings',
            title: 'Trainings',
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
            title: 'Trainees',
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
                    id: 'assassements',
                    title: 'Assassements',
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
    ]
};

export default dashboard;
