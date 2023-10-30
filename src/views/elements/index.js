// material-ui
import { Grid, Typography } from '@mui/material';
import DepartmentCard from 'ui-component/cards/DepartmentCard';
import DepartmentDetailCard from 'ui-component/cards/DepartmentDetailCard';
import trainer from 'assets/images/trainer.jpg';
import facilitator from 'assets/images/facilitator.jpg';
import Cover from 'assets/images/coverimage.png';
import Department from 'assets/images/department.jpg';
import Office from 'assets/images/office.jpg';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TrainerCard from 'ui-component/cards/TrainerCard';
import FacilitatorCard from 'ui-component/cards/FacilitatorCard';
import TrainingCard from 'ui-component/cards/TrainingCard';
import TrainingSessionCard from 'ui-component/cards/TrainingSessionCard';

// ==============================|| SYSTEM ELEMENTS PAGE ||============================== //

const Elements = () => (
    <MainCard title="Elements">
        <Grid container sx={{ flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ marginY: 1 }}>
                Department cards
            </Typography>
            <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                <DepartmentCard
                    isLoading={false}
                    image={Cover}
                    title="Art Department"
                    email="zerihuntegenu5@gmail.com"
                    phone="+251949390840"
                    trainingcount="16"
                    traineecount="2354"
                    onPress={() => {
                        console.log('Department clicked');
                    }}
                />
                <DepartmentDetailCard
                    isLoading={false}
                    image={Cover}
                    title="Illustration Department"
                    email="zerihuntegenu5@gmail.com"
                    phone="+251949390840"
                    coordinator="Zerihun Tegenu"
                    bio="The DepartmentCard component accepts various props such as children, content, contentClass, darkTitle, secondary, sx, contentSX, and title. It also sets a default prop value for the content prop."
                    onPress={() => {
                        console.log('Department Detail clicked');
                    }}
                />
            </Grid>
        </Grid>

        <Grid container sx={{ flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ marginY: 3 }}>
                Trainer components
            </Typography>
            <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                <TrainerCard
                    isLoading={false}
                    image={trainer}
                    qualification={'MSc'}
                    title="Human Capital Development Expert"
                    name="Dr. Abebe Chufa"
                    linkedin="https://mui.com/material-ui/react-card/"
                    address="Addis Ababa"
                    gender="Male"
                    trainingcount="24"
                    rating={2}
                    onPress={() => {
                        console.log('Trainee clicked');
                    }}
                />
            </Grid>
        </Grid>

        <Grid container sx={{ flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ marginY: 3 }}>
                Facilitator components
            </Typography>
            <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                <FacilitatorCard
                    isLoading={false}
                    image={facilitator}
                    qualification={'BSc'}
                    title="Human Capital Development Expert"
                    name="Simahagn Belew"
                    linkedin="https://mui.com/material-ui/react-card/"
                    address="Addis Ababa"
                    gender="Male"
                    trainingcount="24"
                    phone="+251949390840"
                    email="semahagn@gmail.com"
                    onPress={() => {
                        console.log('Facilitator clicked');
                    }}
                />
            </Grid>
        </Grid>

        <Grid container sx={{ flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ marginY: 3 }}>
                Training components
            </Typography>
            <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                <TrainingCard
                    isLoading={false}
                    image={Department}
                    title="Laws adoption"
                    language="Amharic"
                    category="Self Development"
                    departments={8}
                    sessions={23}
                    traineecount={235}
                    rating={5.0}
                    ratingcount={4523}
                    onPress={() => {
                        console.log('Training clicked');
                    }}
                />

                <TrainingSessionCard
                    isLoading={false}
                    image={Office}
                    title="Modern Technologies in Legal Field"
                    language="Amharic"
                    category="Self Development"
                    departments={8}
                    sessions={23}
                    traineecount={235}
                    rating={5.0}
                    ratingcount={4523}
                    onPress={() => {
                        console.log('Training session clicked');
                    }}
                />
            </Grid>
        </Grid>
    </MainCard>
);

export default Elements;
