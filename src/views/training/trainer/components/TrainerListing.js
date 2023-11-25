import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';

const TrainerListing = ({ name, education_level, specialisation, onAssign, isAssigning }) => {
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
                <Typography variant="subtitle1">{name}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Typography variant="body2">{education_level}</Typography>
                    <Typography variant="body2" marginLeft={1}>
                        {specialisation}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <AnimateButton>
                    <Button variant="contained" color="primary" sx={{ marginRight: 1, paddingX: 5.4, borderRadius: 10 }} onClick={onAssign}>
                        {isAssigning}
                    </Button>
                </AnimateButton>
            </Box>
        </Box>
    );
};

TrainerListing.propType = {
    name: PropTypes.string,
    education_level: PropTypes.string,
    specialisation: PropTypes.string,
    onAssign: PropTypes.func,
    isAssigning: PropTypes.node
};
export default TrainerListing;
