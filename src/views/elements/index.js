// material-ui
import { Grid, MenuItem, Typography } from '@mui/material';
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
import SessionDetails from 'ui-component/cards/SessionDetails';
import { Resources } from 'dummies/SessionResources';
import SessionHorizontalCard from 'ui-component/cards/SessionHorizontalCard';
import { IconShare } from '@tabler/icons';

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
                    round="23rd"
                    level="Organization"
                    address="Addis Ababa"
                    capacity={2032}
                    startdate="Nov 12th"
                    enddate="Nov 22, 2023"
                    onPress={() => {
                        console.log('Training session clicked');
                    }}
                />

                <SessionDetails
                    isLoading={false}
                    status="Upcoming"
                    title="Training Details"
                    description="Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed in Ethiopia, training is a cornerstone of development, empowering individuals to unlock their full potential and contribute to a prosperous and inclusive society."
                    startdate="12-3-2023"
                    starttime="2:30 PM"
                    enddate="22-3-2023"
                    endtime="6:00 PM"
                    address="Addis Ababa"
                    capacity="304"
                    resources={Resources}
                />
            </Grid>
        </Grid>

        <Grid container sx={{ flexDirection: 'column' }}>
            <Grid sx={{ display: 'flex', flexDirection: 'row', paddingY: 2 }}>
                <SessionHorizontalCard
                    isLoading={false}
                    image={Department}
                    title="Modern Technologies in Legal Field"
                    description="Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed in Ethiopia, training is a cornerstone of development, empowering individuals to unlock their full potential and contribute to a prosperous and inclusive society."
                    round="23rd"
                    level="Organization"
                    address="Addis Ababa"
                    capacity={2032}
                    startdate="Nov 12th"
                    enddate="Nov 22, 2023"
                    option={true}
                    optionChildrens={
                        <>
                            <MenuItem sx={{ padding: 1.5, paddingX: 2 }}>
                                <IconShare size={20} />
                                <Typography variant="subtitle1" sx={{ marginLeft: 2 }}>
                                    Share
                                </Typography>
                            </MenuItem>
                        </>
                    }
                />
            </Grid>
        </Grid>
    </MainCard>
);

export default Elements;
