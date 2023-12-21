import { IconButton, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconCircleCheck, IconCircleX, IconX } from '@tabler/icons';
import { PropTypes } from 'prop-types';

const ResourceListing = ({ name, quantity, availability, onRemove, removing }) => {
    const theme = useTheme();

    const ActiveUser = JSON.parse(sessionStorage.getItem('user'));
    const role = ActiveUser.user.role;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1.8,
                marginTop: 1,
                borderRadius: 3,
                border: 1,
                borderColor: theme.palette.primary[200]
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                {availability === 1 ? (
                    <IconCircleCheck size={20} color={theme.palette.success.dark} />
                ) : (
                    <IconCircleX size={20} color={theme.palette.error.dark} />
                )}
                <Typography variant="subtitle1" marginLeft={2}>
                    {name}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                {quantity && (
                    <Typography
                        variant="subtitle1"
                        sx={{
                            backgroundColor: theme.palette.primary[200],
                            borderRadius: 3,
                            border: 2,
                            borderColor: theme.palette.primary[200],
                            paddingX: 2,
                            marginRight: 2
                        }}
                    >
                        {quantity}
                    </Typography>
                )}

                {role === 'Admin' ? (
                    <IconButton onClick={onRemove} disabled={removing}>
                        <IconX size={18} />
                    </IconButton>
                ) : role === 'Coordinator' ? (
                    <IconButton onClick={onRemove} disabled={removing}>
                        <IconX size={18} />
                    </IconButton>
                ) : null}
            </Box>
        </Box>
    );
};

ResourceListing.propTypes = {
    name: PropTypes.string,
    quantity: PropTypes.string,
    availability: PropTypes.number,
    onRemove: PropTypes.func,
    removing: PropTypes.bool
};

export default ResourceListing;
