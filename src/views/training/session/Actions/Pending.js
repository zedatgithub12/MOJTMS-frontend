import { Button, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconInfoCircle } from '@tabler/icons';
import PropTypes from 'prop-types';

const Pending = ({ enrolledcount }) => {
    const theme = useTheme();

    return (
        <Box sx={{ marginTop: 2, marginBottom: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconInfoCircle size={18} color={theme.palette.primary.main} />
                <Typography variant="body1" color="primary" marginLeft={0.6}>
                    You have enrolled & waiting for acceptance
                </Typography>
            </Box>
            <Button variant="contained" color="primary" disabled={true} sx={{ marginTop: 2, paddingY: 1.2, paddingX: 8 }}>
                Pending
            </Button>
            {enrolledcount > 1 && (
                <Typography variant="subtitle2" marginTop={1}>
                    {enrolledcount} Peoples are already enrolled
                </Typography>
            )}
        </Box>
    );
};

Pending.propTypes = {
    enrolledcount: PropTypes.number
};

export default Pending;
