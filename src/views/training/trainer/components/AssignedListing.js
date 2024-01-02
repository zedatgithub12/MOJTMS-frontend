import { Chip, Divider, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { IconPlus } from '@tabler/icons';
import PropTypes from 'prop-types';

const AssignedListing = ({
    name,
    education_level,
    specialisation,

    isRemoving,
    onAddSurvey,
    onView,
    surveyAssigned,
    surveyStatus,
    canReview,
    onRemoveSurvey
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    const CanReview = () => {
        if (role === 'Trainee' && canReview && surveyAssigned && surveyStatus === 'ongoing') {
            return true;
        }
        return false;
    };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 1,
                marginY: 1
            }}
        >
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1">{t(name)} </Typography>
                    {CanReview() ? (
                        <Chip color="secondary" label={t('Review Trainer')} size="small" sx={{ marginLeft: 1 }} onClick={onView} />
                    ) : role === 'Admin' && surveyAssigned ? (
                        <Chip
                            color="secondary"
                            label={t('Survey Assigned')}
                            size="small"
                            sx={{ marginLeft: 1 }}
                            onClick={onView}
                            onDelete={onRemoveSurvey}
                        />
                    ) : role === 'Admin' ? (
                        <Chip
                            icon={<IconPlus size={14} style={{ color: theme.palette.primary.main }} />}
                            label={t('Add Survey')}
                            size="small"
                            sx={{
                                backgroundColor: theme.palette.primary[200],
                                color: theme.palette.primary.main,
                                marginLeft: 1,
                                padding: 0.5
                            }}
                            onClick={onAddSurvey}
                        />
                    ) : null}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {education_level && (
                        <Typography variant="body2" paddingRight={1}>
                            {t(education_level)}
                        </Typography>
                    )}
                    <Divider orientation="vertical" flexItem />
                    {specialisation && (
                        <Typography variant="body2" marginLeft={1}>
                            {t(specialisation)}
                        </Typography>
                    )}
                </Box>
            </Box>

            {role === 'Admin' ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Typography variant="body1" marginRight={2}>
                        {t(status)}
                    </Typography> */}
                    {isRemoving}
                </Box>
            ) : role === 'Coordinator' ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Typography variant="body1" marginRight={2}>
                        {t(status)}
                    </Typography> */}
                    {isRemoving}
                </Box>
            ) : null}
        </Box>
    );
};

AssignedListing.propTypes = {
    name: PropTypes.string,
    education_level: PropTypes.string,
    specialisation: PropTypes.string,
    isRemoving: PropTypes.node,
    onAddSurvey: PropTypes.func,
    onView: PropTypes.func,
    surveyAssigned: PropTypes.bool,
    surveyStatus: PropTypes.string,
    canReview: PropTypes.bool,
    onRemoveSurvey: PropTypes.func
};
export default AssignedListing;
