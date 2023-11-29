import { Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import PropTypes from 'prop-types';

const AssignedListing = ({ name, education_level, job_title, status, isRemoving }) => {
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
                    {education_level && <Typography variant="body2">{education_level}</Typography>}
                    {job_title && (
                        <Typography variant="body2" marginLeft={1} sx={{ borderLeft: 1, paddingLeft: 1.6 }}>
                            {job_title}
                        </Typography>
                    )}
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
                            backgroundColor: status === 'rejected' ? theme.palette.error.light : theme.palette.primary[200]
                        }}
                    >
                        {status}
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
                            backgroundColor: status === 'rejected' ? theme.palette.error.light : theme.palette.primary[200]
                        }}
                    >
                        {status}
                    </Typography>
                    {isRemoving}
                </Box>
            ) : null}
        </Box>
    );
};

AssignedListing.propType = {
    name: PropTypes.string,
    education_level: PropTypes.string,
    job_title: PropTypes.string,
    status: PropTypes.string,
    isRemoving: PropTypes.node
};
export default AssignedListing;
