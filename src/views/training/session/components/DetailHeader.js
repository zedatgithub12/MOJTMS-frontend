import { Grid, Box, IconButton, Typography } from '@mui/material';
import { IconArrowLeft } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { ActionMenu } from 'ui-component/menu/action';
import PropTypes from 'prop-types';

const DetailHeader = ({ children, title, back, option, optionChildrens, sx }) => {
    const navigate = useNavigate();

    return (
        <Grid
            container
            sx={{
                transition: 'all 0.9s ease-in-out',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                ...sx
            }}
        >
            <Grid
                container
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    paddingX: 2,
                    pt: 1
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                    {back && (
                        <IconButton onClick={() => navigate(-1)}>
                            <IconArrowLeft />
                        </IconButton>
                    )}

                    <Typography color={'white'} variant="h4" sx={{ transition: 'opacity 0.8s ease-in-out', paddingX: 1 }}>
                        {title}
                    </Typography>
                </Box>

                {option && <ActionMenu children={optionChildrens} />}
            </Grid>

            <Grid
                container
                sx={{
                    justifyContent: 'center',
                    transition: 'opacity 0.8s ease-in-out',
                    paddingY: 1,
                    zIndex: 4,
                    overflow: 'hidden'
                }}
            >
                {children}
            </Grid>
        </Grid>
    );
};

DetailHeader.propTypes = {
    back: PropTypes.bool,
    title: PropTypes.string,
    children: PropTypes.node,
    option: PropTypes.bool,
    optionChildrens: PropTypes.node,
    sx: PropTypes.object
};

export default DetailHeader;
