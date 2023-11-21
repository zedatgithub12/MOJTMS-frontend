import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';

//materials routing
const Materials = Loadable(lazy(() => import('views/materials')));

//session routing
const CreateSession = Loadable(lazy(() => import('views/training/session/create')));

// ==============================|| SECONDARY ROUTING ||============================== //

const SecondaryRoutes = {
    path: '/',
    element: <Materials />,
    children: [
        {
            path: '/training/module/materials',
            element: <Materials />
        }
    ],

    path: '/',
    element: <CreateSession />,
    children: [
        {
            path: '/training/session/create',
            element: <CreateSession />
        }
    ]
};

export default SecondaryRoutes;
