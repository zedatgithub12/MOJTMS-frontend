import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';

export const IconLabel = ({ content, label, children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 1.2 }}>
            <Box>{children}</Box>
            <Box sx={{ marginLeft: 2 }}>
                <Typography
                    variant="subtitle1"
                    sx={{
                        maxWidth: '400px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {content}
                </Typography>
                <Typography variant="subtitle2">{label}</Typography>
            </Box>
        </Box>
    );
};

IconLabel.propTypes = {
    content: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.node
};
