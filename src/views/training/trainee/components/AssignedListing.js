import { Button, Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';

const AssignedListing = ({ name, education_level, job_title, status, onAccept, isAccepting, isRemoving }) => {
    const { t } = useTranslation();
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
                <Typography variant="subtitle1">{t(name)}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {education_level && <Typography variant="body2">{t(education_level)}</Typography>}
                    {job_title && (
                        <Typography variant="body2" marginLeft={1} sx={{ borderLeft: 1, paddingLeft: 1.6 }}>
                            {t(job_title)}
                        </Typography>
                    )}
                </Box>
            </Box>

            {role === 'Admin' ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {status === 'pending' ? (
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <AnimateButton>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginRight: 1, paddingX: 5.4, borderRadius: 10 }}
                                    onClick={onAccept}
                                >
                                    {isAccepting}
                                </Button>
                            </AnimateButton>
                        </Box>
                    ) : (
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
                            {t(status)}
                        </Typography>
                    )}

                    {isRemoving}
                </Box>
            ) : role === 'Coordinator' ? (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {status === 'pending' ? (
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <AnimateButton>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginRight: 1, paddingX: 5.4, borderRadius: 10 }}
                                    onClick={onAccept}
                                >
                                    {isAccepting}
                                </Button>
                            </AnimateButton>
                        </Box>
                    ) : (
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
                            {t(status)}
                        </Typography>
                    )}

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
    onAccept: PropTypes.func,
    isAccepting: PropTypes.node,
    status: PropTypes.string,
    isRemoving: PropTypes.node
};
export default AssignedListing;
