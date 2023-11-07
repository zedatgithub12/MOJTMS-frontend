import { Grid, Box, IconButton, Typography, useTheme } from '@mui/material';
import { IconArrowLeft } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { ActionMenu } from 'ui-component/menu/action';
import PropTypes from 'prop-types';

export const MiniHeader = ({ title, back, option, optionChildrens, sx }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Grid
            container
            sx={{
                height: '60px',
                transition: 'height 0.3s ease-in-out',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                ...sx
            }}
        >
            <Grid
                container
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingX: 2 }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {back && (
                        <IconButton onClick={() => navigate(-1)}>
                            <IconArrowLeft color={theme.palette.background.default} />
                        </IconButton>
                    )}

                    <Typography color={'white'} variant="h4" sx={{ paddingX: 1 }}>
                        {title}
                    </Typography>
                </Box>

                {option && <ActionMenu children={optionChildrens} />}
            </Grid>
        </Grid>
    );
};

MiniHeader.propTypes = {
    back: PropTypes.bool,
    title: PropTypes.string,
    option: PropTypes.bool,
    optionChildrens: PropTypes.node,
    sx: PropTypes.object
};
