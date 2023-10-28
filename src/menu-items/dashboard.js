// assets
import { IconDashboard, IconHome, IconBuildingStore, IconUsers, IconClipboardList, IconBuilding, IconSchool } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconBuildingStore, IconUsers, IconHome, IconClipboardList, IconBuilding, IconSchool };

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
            url: '/sample-page',
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
                    id: 'categories',
                    title: 'Categories',
                    url: '/sample-page',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'trainings',
                    title: 'Trainings',
                    url: '/sample-page',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'sessions',
                    title: 'Training Sessions',
                    url: '/sample-page',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'trainers',
                    title: 'Trainers',
                    url: '/sample-page',
                    type: 'item',
                    breadcrumbs: false
                },
                {
                    id: 'facilitators',
                    title: 'Facilitators',
                    url: '/sample-page',
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
            icon: icons.IconUsers,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
