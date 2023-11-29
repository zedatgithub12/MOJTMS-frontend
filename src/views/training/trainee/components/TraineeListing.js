import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';

const TraineeListing = ({ name, education_level, job_title, onAssign, isAssigning }) => {
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
                    {education_level && <Typography variant="body2">{education_level}</Typography>}
                    {job_title && (
                        <Typography variant="body2" marginLeft={1} sx={{ borderLeft: 1, paddingLeft: 1.6 }}>
                            {job_title}
                        </Typography>
                    )}
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

TraineeListing.propType = {
    name: PropTypes.string,
    education_level: PropTypes.string,
    job_title: PropTypes.string,
    onAssign: PropTypes.func,
    isAssigning: PropTypes.node
};
export default TraineeListing;
