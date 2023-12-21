import { Box, Typography, useTheme } from '@mui/material';
import { IconClock, IconLayoutList, IconTrophy } from '@tabler/icons';
import { TimeFormatter } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';

const AssessmentListing = ({ name, question, duration, score, selected, type, onSelected, actionButton }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 1.4
            }}
        >
            <Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Typography variant="subtitle1">{t(name)} </Typography>
                    {type && (
                        <Typography
                            variant="body2"
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                paddingX: 2,
                                borderRadius: 2,
                                marginLeft: 1,
                                color: theme.palette.primary.main
                            }}
                        >
                            {t(type)}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingY: 0.8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 3 }}>
                        <IconLayoutList size={18} />
                        <Typography variant="body2" marginLeft={1}>
                            {t(question)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 3 }}>
                        <IconClock size={18} />
                        <Typography variant="body2" marginLeft={1}>
                            {TimeFormatter(duration)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <IconTrophy size={18} />
                        <Typography variant="body2" marginLeft={1}>
                            {score}%
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <AnimateButton>{actionButton}</AnimateButton>
        </Box>
    );
};

AssessmentListing.propTypes = {
    name: PropTypes.string,
    duration: PropTypes.string,
    score: PropTypes.string,
    question: PropTypes.string,
    type: PropTypes.string,
    selected: PropTypes.bool,
    onSelected: PropTypes.func,
    actionButton: PropTypes.node
};

export default AssessmentListing;
