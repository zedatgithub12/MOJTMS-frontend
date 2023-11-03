import { Box, Typography } from '@mui/material';
import { IconCalendar, IconMail, IconUser } from '@tabler/icons';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import NaturePeopleOutlinedIcon from '@mui/icons-material/NaturePeopleOutlined';
import PropTypes from 'prop-types';

export const View = ({ user, children }) => {
    return (
        <Box sx={{ paddingX: 2 }}>
            <Box paddingY={1} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">User Details </Typography>
                <Box>
                    <>{children}</>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                <IconUser size={22} />
                <Box sx={{ paddingX: 2 }}>
                    <Typography variant="subtitle1">{user.name} </Typography>
                    <Typography variant="subtitle2">Full name </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                <IconMail size={20} />
                <Box sx={{ paddingX: 2 }}>
                    <Typography variant="subtitle1">{user.email} </Typography>
                    <Typography variant="subtitle2">Email address </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                <BadgeOutlinedIcon size={18} />
                <Box sx={{ paddingX: 2 }}>
                    <Typography variant="subtitle1">{user.role} </Typography>
                    <Typography variant="subtitle2">Role </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                <NaturePeopleOutlinedIcon size={18} />
                <Box sx={{ paddingX: 2 }}>
                    <Typography variant="subtitle1" textTransform={'capitalize'}>
                        {user.status}{' '}
                    </Typography>
                    <Typography variant="subtitle2">Status </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                <IconCalendar size={20} />
                <Box sx={{ paddingX: 2 }}>
                    <Typography variant="subtitle1">{user.created_at} </Typography>
                    <Typography variant="subtitle2">Added on </Typography>
                </Box>
            </Box>
        </Box>
    );
};

View.PropTypes = {
    user: PropTypes.object,
    children: PropTypes.node
};
