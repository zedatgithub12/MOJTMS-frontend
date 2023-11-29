import { Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import PropTypes from 'prop-types';

const AssignedListing = ({ name, email, isRemoving }) => {
    const theme = useTheme();
    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;
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

            {role === 'Admin' ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Typography
                        variant="body1"
                        marginRight={2}
                        sx={{
                            textTransform: 'capitalize',
                            borderRadius: 4,
                            paddingX: 3,
                            paddingY: 0.5,
                            backgroundColor: theme.palette.primary[200]
                        }}
                    >
                        Assigned
                    </Typography>
                    {isRemoving}
                </Box>
            ) : role === 'Coordinator' ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Typography
                        variant="body1"
                        marginRight={2}
                        sx={{
                            textTransform: 'capitalize',
                            borderRadius: 4,
                            paddingX: 3,
                            paddingY: 0.5,
                            backgroundColor: theme.palette.primary[200]
                        }}
                    >
                        Assigned
                    </Typography>
                    {isRemoving}
                </Box>
            ) : null}
        </Box>
    );
};

AssignedListing.propTypes = {
    name: PropTypes.string,
    email: PropTypes.string,
    isRemoving: PropTypes.node
};
export default AssignedListing;
