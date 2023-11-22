import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

//department routing
const Department = Loadable(lazy(() => import('views/department')));
const ViewDepartment = Loadable(lazy(() => import('views/department/view')));
const AddDepartment = Loadable(lazy(() => import('views/department/add')));
const UpdateDepartment = Loadable(lazy(() => import('views/department/update')));

//Trainers routing
const Trainers = Loadable(lazy(() => import('views/trainer')));
const AddTrainer = Loadable(lazy(() => import('views/trainer/add')));
const ViewTrainer = Loadable(lazy(() => import('views/trainer/view')));
const UpdateTrainer = Loadable(lazy(() => import('views/trainer/update')));

//category routing
const Category = Loadable(lazy(() => import('views/category')));

//Training routing
const Training = Loadable(lazy(() => import('views/training')));
const AddTraining = Loadable(lazy(() => import('views/training/add')));
const ViewTraining = Loadable(lazy(() => import('views/training/view')));
const UpdateTraining = Loadable(lazy(() => import('views/training/update')));

// Modules Routing
const TrainingModules = Loadable(lazy(() => import('views/training/module')));

//Assessments Routing
const Assessment = Loadable(lazy(() => import('views/evaluations/assessment')));
const CreateAssessment = Loadable(lazy(() => import('views/evaluations/assessment/create')));
const UpdateAssessment = Loadable(lazy(() => import('views/evaluations/assessment/update')));
const ViewAssessement = Loadable(lazy(() => import('views/evaluations/assessment/view')));

//surveys Routing
const Survey = Loadable(lazy(() => import('views/evaluations/survey')));
const CreateSurvey = Loadable(lazy(() => import('views/evaluations/survey/create')));
const UpdateSurvey = Loadable(lazy(() => import('views/evaluations/survey/update')));
const ViewSurvey = Loadable(lazy(() => import('views/evaluations/survey/view')));

//element page routing
const Elements = Loadable(lazy(() => import('views/elements')));

//Trainees page routing
const Trainee = Loadable(lazy(() => import('views/trainee')));
const TraineeDetails = Loadable(lazy(() => import('views/trainee/detail')));
const UpdateTrainee = Loadable(lazy(() => import('views/trainee/update')));
//users routing
const Users = Loadable(lazy(() => import('views/users')));

//account routing
const AccountSetting = Loadable(lazy(() => import('views/profile/account-setting')));
const Changepassword = Loadable(lazy(() => import('views/profile/change-password')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },

        {
            path: 'users',
            element: <Users />
        },

        {
            path: 'utils',
            children: [
                {
                    path: 'util-typography',
                    element: <UtilsTypography />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-color',
                    element: <UtilsColor />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-shadow',
                    element: <UtilsShadow />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'tabler-icons',
                    element: <UtilsTablerIcons />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'material-icons',
                    element: <UtilsMaterialIcons />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'account-setting',
            element: <AccountSetting />
        },
        {
            path: 'change-password',
            element: <Changepassword />
        },

        {
            path: 'elements',
            element: <Elements />
        },
        {
            path: 'trainees',
            element: <Trainee />
        },
        {
            path: 'trainee/details',
            element: <TraineeDetails />
        },
        { path: 'trainee/update', element: <UpdateTrainee /> },

        //departments
        {
            path: 'departments',
            element: <Department />
        },
        {
            path: 'department/view',
            element: <ViewDepartment />
        },
        {
            path: 'department/add',
            element: <AddDepartment />
        },
        {
            path: 'department/update',
            element: <UpdateDepartment />
        },

        //trainers
        {
            path: 'trainers',
            element: <Trainers />
        },
        {
            path: 'trainer/view',
            element: <ViewTrainer />
        },
        {
            path: 'trainer/add',
            element: <AddTrainer />
        },
        {
            path: 'trainer/update',
            element: <UpdateTrainer />
        },

        //categories

        {
            path: 'categories',
            element: <Category />
        },

        //trainings
        {
            path: 'trainings',
            element: <Training />
        },
        {
            path: 'training/add',
            element: <AddTraining />
        },
        {
            path: 'training/view',
            element: <ViewTraining />
        },
        {
            path: 'training/update',
            element: <UpdateTraining />
        },

        {
            path: 'training/modules',
            element: <TrainingModules />
        },

        //evaluations

        {
            path: 'assessments',
            element: <Assessment />
        },
        {
            path: 'assessment/create',
            element: <CreateAssessment />
        },
        {
            path: 'assessment/update',
            element: <UpdateAssessment />
        },
        {
            path: 'assessment/view',
            element: <ViewAssessement />
        },

        {
            path: 'survey',
            element: <Survey />
        },
        {
            path: 'survey/create',
            element: <CreateSurvey />
        },
        {
            path: 'survey/update',
            element: <UpdateSurvey />
        },
        {
            path: 'survey/view',
            element: <ViewSurvey />
        }
    ]
};

export default MainRoutes;
