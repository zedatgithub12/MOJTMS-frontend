import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';

// assets
import { IconMenu2 } from '@tabler/icons';
import { useContext } from 'react';
import { AuthContext } from 'context/context';
import Language from 'ui-component/language';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    const { getRole } = useContext(AuthContext);

    const userRole = () => {
        return getRole();
    };

    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                {userRole() != 'Trainee' && (
                    <ButtonBase sx={{ borderRadius: '30px', overflow: 'hidden' }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.background.default,
                                color: theme.palette.secondary.dark,
                                '&:hover': {
                                    background: theme.palette.background.default,
                                    color: theme.palette.secondary.dark
                                }
                            }}
                            onClick={handleLeftDrawerToggle}
                            color="inherit"
                        >
                            <IconMenu2 stroke={1.5} size="1.5rem" />
                        </Avatar>
                    </ButtonBase>
                )}
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1, marginLeft: 4 }}>
                    <LogoSection />
                </Box>
            </Box>

            {/* header search
            <SearchSection /> */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            {/* notification & profile */}
            {/* <NotificationSection /> */}
            <Language />
            <ProfileSection />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
