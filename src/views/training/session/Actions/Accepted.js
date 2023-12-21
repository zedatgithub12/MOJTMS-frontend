import { Button, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconInfoCircle } from '@tabler/icons';
import PropTypes from 'prop-types';

const Accepted = ({ type, onTakeAssessment }) => {
    const theme = useTheme();

    return (
        <Box sx={{ marginTop: 2, marginBottom: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconInfoCircle size={18} color={theme.palette.primary.main} />
                <Typography variant="body1" color="primary" marginLeft={0.6}>
                    Take {type} training assessment
                </Typography>
            </Box>

            <Button variant="contained" color="primary" sx={{ marginTop: 2, paddingY: 1.2, paddingX: 6 }} onClick={onTakeAssessment}>
                {type} Training Assessment
            </Button>
        </Box>
    );
};

Accepted.propTypes = {
    type: PropTypes.string,
    onTakeAssessment: PropTypes.func
};

export default Accepted;
