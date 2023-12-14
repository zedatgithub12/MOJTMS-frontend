import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ListingComponent = ({ content, label }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                marginY: 2,
                paddingX: 3
            }}
        >
            <Typography variant="subtitle1" sx={{ marginBottom: 0.5 }}>
                {content}
            </Typography>
            <Typography color="grey"> {label} </Typography>
        </Box>
    );
};

ListingComponent.propTypes = {
    content: PropTypes.string,
    label: PropTypes.string
};

export default ListingComponent;
