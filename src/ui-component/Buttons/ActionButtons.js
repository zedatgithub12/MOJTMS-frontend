import { IconButton, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { IconEdit, IconTrash } from '@tabler/icons';
import PropTypes from 'prop-types';

const ActionButtons = ({ onEdit, onDelete }) => {
    const theme = useTheme();
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {onEdit && (
                <IconButton onClick={onEdit}>
                    <IconEdit size={16} />
                </IconButton>
            )}
            {onDelete && (
                <IconButton onClick={onDelete}>
                    <IconTrash size={16} color={theme.palette.error.main} />
                </IconButton>
            )}
        </Box>
    );
};

ActionButtons.propTypes = {
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};

export default ActionButtons;
