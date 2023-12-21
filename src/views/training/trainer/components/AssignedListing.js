import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const AssignedListing = ({ name, education_level, specialisation, status, isRemoving }) => {
    const { t } = useTranslation();

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
                <Typography variant="subtitle1">{t(name)}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {education_level && (
                        <Typography variant="body2" paddingRight={1}>
                            {t(education_level)}
                        </Typography>
                    )}{' '}
                    <Divider orientation="vertical" flexItem />
                    {specialisation && (
                        <Typography variant="body2" marginLeft={1}>
                            {t(specialisation)}
                        </Typography>
                    )}
                </Box>
            </Box>

            {role === 'Admin' ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Typography variant="body1" marginRight={2}>
                        {t(status)}
                    </Typography>
                    {isRemoving}
                </Box>
            ) : role === 'Coordinator' ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Typography variant="body1" marginRight={2}>
                        {t(status)}
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
    specialisation: PropTypes.string,
    status: PropTypes.string,
    isRemoving: PropTypes.node
};
export default AssignedListing;
