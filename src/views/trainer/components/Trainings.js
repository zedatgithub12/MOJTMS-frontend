// material-ui
import { Grid, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { useTranslation } from 'react-i18next';
import TrainingSessionCard from 'ui-component/cards/TrainingSessionCard';
import TrainingSessionSkel from 'ui-component/cards/Skeleton/TrainingSessionSkel';
import errorImage from 'assets/images/error.jpg';

// ==============================|| VIEW TRAINER PAGE ||============================== //

const TrainerTrainings = ({ loading, error, trainings, trainer_name, children }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Grid
            container
            sx={{
                borderRadius: 4,
                background: theme.palette.primary.light
            }}
        >
            <Grid item xs={12}>
                <Typography variant="body2">
                    {t('The training that given by')} <b> {trainer_name}</b>
                </Typography>
                {loading ? (
                    <Grid container>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                                <TrainingSessionSkel key={index} />
                            ))}
                        </Grid>
                    </Grid>
                ) : error ? (
                    <ErrorPrompt image={errorImage} title="" message="Oooops... There is server error fetching trainings!" />
                ) : trainings.length === 0 ? (
                    <NoResult title="" message="Oooops... no training found" />
                ) : (
                    <div>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingY: 3 }}>
                            {trainings.map((training) => (
                                <TrainingSessionCard
                                    isLoading={false}
                                    status={training.session.status}
                                    title={training.session.training_name}
                                    round={training.session.round_number}
                                    address={training.session.address}
                                    capacity={training.session.maximum_capacity}
                                    startdate={training.session.start_date}
                                    enddate={training.session.end_date}
                                    onPress={() => navigate('/training/session/detail', { state: training.session })}
                                    sx={{ marginX: 1 }}
                                />
                            ))}
                        </Grid>
                    </div>
                )}
            </Grid>
            {children}
        </Grid>
    );
};

export default TrainerTrainings;
