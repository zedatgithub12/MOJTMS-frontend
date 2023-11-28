import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';

const FacilitatorListing = ({ name, email, onAssign, isAssigning }) => {
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
                    {email && <Typography variant="body2">{email}</Typography>}
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

FacilitatorListing.propTypes = {
    name: PropTypes.string,
    email: PropTypes.string,
    onAssign: PropTypes.func,
    isAssigning: PropTypes.node
};
export default FacilitatorListing;
