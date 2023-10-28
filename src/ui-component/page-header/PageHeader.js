import { Grid, IconButton, useTheme } from '@mui/material';
import { IconArrowLeft } from '@tabler/icons';
import { useNavigate } from 'react-router';
import { ActionMenu } from 'ui-component/menu/action';
import PropTypes from 'prop-types';

export const PageHeader = ({ children, back, option, optionChildrens }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Grid container sx={{ backgroundColor: theme.palette.primary[200], borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
            <Grid
                item
                xs={12}
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}
            >
                {back && (
                    <IconButton onClick={() => navigate(-1)}>
                        <IconArrowLeft />
                    </IconButton>
                )}

                {option && <ActionMenu children={optionChildrens} />}
            </Grid>
            <Grid item xs={12} sx={{ padding: 4 }}>
                {children}
            </Grid>
        </Grid>
    );
};

PageHeader.propTypes = {
    back: PropTypes.bool,
    children: PropTypes.node,
    option: PropTypes.bool,
    optionChildrens: PropTypes.node
};
