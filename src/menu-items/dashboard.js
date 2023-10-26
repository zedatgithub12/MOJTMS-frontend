// assets
import { IconDashboard, IconBuildingStore, IconUsers, IconHome, IconClipboardList } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconBuildingStore, IconUsers, IconHome, IconClipboardList };

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
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'items',
            title: 'Products',
            type: 'item',
            url: '/products',
            icon: icons.IconClipboardList,
            breadcrumbs: false
        },

        {
            id: 'users',
            title: 'Users',
            type: 'collapse',
            url: '/sample-page',
            icon: icons.IconUsers,
            breadcrumbs: false,
            children: [
                {
                    id: 'admins',
                    title: 'Admin',
                    type: 'item',
                    url: '/icons/tabler-icons',
                    breadcrumbs: false
                },
                {
                    id: 'editor',
                    title: 'Editors',
                    type: 'item',
                    url: '/icons/material-icons',
                    breadcrumbs: false
                },
                {
                    id: 'customer',
                    title: 'Customers',
                    type: 'item',
                    url: '/icons/material-icons',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default dashboard;
