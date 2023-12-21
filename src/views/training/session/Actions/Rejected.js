import { Button, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconInfoCircle } from '@tabler/icons';
import PropTypes from 'prop-types';

const Rejected = ({ enrolledcount }) => {
    const theme = useTheme();

    return (
        <Box sx={{ marginTop: 2, marginBottom: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconInfoCircle size={18} color={theme.palette.primary.main} />
                <Typography variant="body1" color="primary" marginLeft={0.6}>
                    You declined taking this training
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Button variant="contained" color="primary" disabled sx={{ marginTop: 2, paddingY: 1.2, paddingX: 8 }}>
                    Declined
                </Button>
            </Box>

            {enrolledcount > 1 && (
                <Typography variant="subtitle2" marginTop={1.4}>
                    {enrolledcount} Peoples are already enrolled
                </Typography>
            )}
        </Box>
    );
};

Rejected.propTypes = {
    enrolledcount: PropTypes.number
};
export default Rejected;
