import { lazy } from 'react';
import Loadable from 'ui-component/Loadable';

//materials routing
const Materials = Loadable(lazy(() => import('views/materials')));

// ==============================|| SECONDARY ROUTING ||============================== //

const SecondaryRoutes = {
    path: '/',
    element: <Materials />,
    children: [
        {
            path: '/training/module/materials',
            element: <Materials />
        }
    ]
};

export default SecondaryRoutes;
