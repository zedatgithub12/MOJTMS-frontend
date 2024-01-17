import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const ListingComponent = ({ content, label }) => {
    const { t } = useTranslation();
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
                {t(content)}
            </Typography>
            <Typography color="grey"> {t(label)} </Typography>
        </Box>
    );
};

ListingComponent.propTypes = {
    content: PropTypes.string,
    label: PropTypes.string
};

export default ListingComponent;
