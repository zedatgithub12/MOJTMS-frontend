import { Button, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconClock, IconLayoutList, IconTrophy } from '@tabler/icons';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { TimeFormatter } from 'utils/functions';

const AssessmentListing = ({ name, question, duration, score, selected, type, onSelected, actionButton }) => {
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
                    <Typography variant="subtitle1">{name} </Typography>
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
                            {type}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingY: 0.8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 3 }}>
                        <IconLayoutList size={18} />
                        <Typography variant="body2" marginLeft={1}>
                            {question}
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
