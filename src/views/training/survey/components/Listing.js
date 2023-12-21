import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { IconLayoutList } from '@tabler/icons';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';

const SurveyListing = ({ name, question, actionButton }) => {
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
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingY: 0.8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 3 }}>
                        <IconLayoutList size={18} />
                        <Typography variant="body2" marginLeft={1}>
                            {question}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <AnimateButton>{actionButton}</AnimateButton>
        </Box>
    );
};

SurveyListing.propTypes = {
    name: PropTypes.string,
    question: PropTypes.string,
    selected: PropTypes.bool,
    onSelected: PropTypes.func,
    actionButton: PropTypes.node
};

export default SurveyListing;
