import { useState } from 'react';
// material-ui
import {
    Grid,
    Box,
    Typography,
    useTheme,
    CardMedia,
    useMediaQuery,
    MenuItem,
    ListItemIcon,
    Divider,
    Tabs,
    Tab,
    Rating,
    Button
} from '@mui/material';
import { PageHeader } from 'ui-component/page-header/PageHeader';
import { useLocation, useNavigate } from 'react-router';
import { IconLabel } from 'ui-component/content/IconLabel';
import { IconChalkboard, IconEdit, IconLanguage, IconPaperclip, IconUser } from '@tabler/icons';
import { TrainingTabs } from 'data/tabs/training';
import { TabPanel } from './components/tabpanel';
import { StarOutline } from '@mui/icons-material';
import { ReadMore } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import TrainingModules from './module';
import SessionListing from './session/components/Listing';
import TrainingTrainees from './trainee/trainingtrainees';
import FilledSurveys from './survey/filledsurveys';
import TrainersSurveys from './trainer/trainerssurveys';

// ==============================|| VIEW TRAINING PAGE ||============================== //

function a11yProps(index) {
    return {
        id: `training-tab-${index}`,
        'aria-controls': `training-tabpanel-${index}`
    };
}

const letterConfig = {
    startfrom: 0,
    endat: 150
};

const ViewTraining = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();

    const ImageApi = Connections.thumbnails;
    const bigDevice = useMediaQuery(theme.breakpoints.up('md'));

    const [tab, setTab] = useState(0);
    const [collapse, setCollapse] = useState(true);

    const ExpndText = () => {
        setCollapse(!collapse);
    };

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
                <Grid
                    container
                    sx={{
                        minHeight: '80dvh',
                        marginBottom: 2,
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: theme.palette.primary[200] + 25,
                        ':hover': {
                            boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                        }
                    }}
                >
                    <PageHeader
                        back={true}
                        title={state.title}
                        option={true}
                        optionChildrens={
                            <Box>
                                <MenuItem onClick={() => navigate('/training/update', { state: state })}>
                                    <ListItemIcon>
                                        <IconEdit size={18} />
                                    </ListItemIcon>
                                    {t('Update')}
                                </MenuItem>
                            </Box>
                        }
                        sx={{ background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})` }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between'
                            }}
                        >
                            {state.thumbnail && bigDevice && (
                                <CardMedia
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        boxShadow: 2,
                                        borderRadius: 6,
                                        border: 4,
                                        borderColor: theme.palette.secondary.light,
                                        aspectRatio: 1
                                    }}
                                    image={ImageApi + state.thumbnail}
                                    title={t(state.name)}
                                />
                            )}

                            <Box sx={{ marginX: 3, padding: 0.2 }}>
                                {state.title ? (
                                    <Typography variant="h3">{t(state.title)}</Typography>
                                ) : (
                                    <Typography variant="h4">{t('Training title')}</Typography>
                                )}
                                {state.description && (
                                    <Typography
                                        variant="subtitle1"
                                        marginTop={1}
                                        sx={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                        {t(state.description)}
                                    </Typography>
                                )}

                                <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: 1 }}>
                                    {state.language && (
                                        <IconLabel content={state.language} sx={{ marginRight: 2 }}>
                                            <IconLanguage size={20} style={{ color: theme.palette.secondary.main }} />
                                        </IconLabel>
                                    )}

                                    {state.category && (
                                        <IconLabel content={state.category}>
                                            <Divider orientation="vertical" flexItem sx={{ width: 10, height: 16 }} />
                                        </IconLabel>
                                    )}
                                </Box>
                                <Box
                                    sx={{
                                        width: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginTop: 1,
                                        pl: 0.5
                                    }}
                                >
                                    <Typography variant="subtitle1"> {parseInt(state.trainee_reviews_avg_rating).toFixed(1)}</Typography>
                                    <Rating
                                        name="hover-feedback"
                                        value={parseInt(state.trainee_reviews_avg_rating)}
                                        readOnly
                                        emptyIcon={<StarOutline style={{ opacity: 0.85 }} fontSize="inherit" />}
                                        sx={{ marginX: 2 }}
                                    />
                                    <Typography variant="body2">({state.trainee_reviews_count})</Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginY: 3, paddingX: 5, paddingY: 1.4, borderRadius: 50 }}
                                    onClick={() => navigate('/training/session/create', { state: state })}
                                >
                                    {t('Create new session')}
                                </Button>
                            </Box>
                        </Box>
                    </PageHeader>

                    <Grid
                        container
                        sx={{
                            minHeight: 200,
                            padding: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-around'
                        }}
                    >
                        <Grid item xs={12} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Tabs value={tab} onChange={handleChange} aria-label="tabs">
                                {TrainingTabs.map((tab, index) => (
                                    <Tab key={index} label={t(tab.name)} {...a11yProps(index)} />
                                ))}
                            </Tabs>

                            <TabPanel value={tab} index={0}>
                                <SessionListing training_id={state.id} />
                            </TabPanel>
                            <TabPanel value={tab} index={1}>
                                <TrainingModules training_id={state.id} />
                            </TabPanel>

                            <TabPanel value={tab} index={2}>
                                <TrainingTrainees training_id={state.id} />
                            </TabPanel>
                            <TabPanel value={tab} index={3}>
                                <FilledSurveys training_id={state.id} />
                            </TabPanel>
                            <TabPanel value={tab} index={4}>
                                <TrainersSurveys training_id={state.id} />
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={3} xl={3} sx={bigDevice ? { paddingX: 2 } : { paddingY: 2 }}>
                <Grid
                    item
                    xs={12}
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 2,
                        background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})`,
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Typography variant="h4" sx={{}}>
                        {t('Training')} {t('Summaries')}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginY: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <IconChalkboard size={20} sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="body2" sx={{ paddingLeft: 1 }}>
                                {t('Sessions')}
                            </Typography>
                        </Box>

                        <Typography variant="subtitle1">{state.sessions_count}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginY: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <IconUser size={20} />
                            <Typography variant="body2" sx={{ paddingLeft: 1 }}>
                                {t('Trainees')}
                            </Typography>
                        </Box>

                        <Typography variant="subtitle1">{state.enrollments_count}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginY: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <IconPaperclip size={20} />
                            <Typography variant="body2" sx={{ paddingLeft: 1 }}>
                                {t('Modules')}
                            </Typography>
                        </Box>

                        <Typography variant="subtitle1">{state.modules_count}</Typography>
                    </Box>
                    <Divider />
                    {state.prerequisites && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                            <Typography variant="subtitle2">{t('Training Pre-requisites')}</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1 }}>
                                <Typography variant="body2">
                                    {ReadMore(state.prerequisites, letterConfig.startfrom, letterConfig.endat, collapse)}
                                </Typography>

                                {state.prerequisites.length > letterConfig.endat && (
                                    <Typography
                                        component={'div'}
                                        onClick={() => ExpndText()}
                                        sx={{ marginTop: 1, color: theme.palette.primary.main }}
                                    >
                                        {collapse ? t('Read More') : t('Read Less')}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ViewTraining;
