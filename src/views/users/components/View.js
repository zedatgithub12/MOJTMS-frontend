import { Box, Typography } from '@mui/material';
import { IconCalendar, IconMail, IconUser } from '@tabler/icons';
import { DateFormatter } from 'utils/functions';
import { useTranslation } from 'react-i18next';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import NaturePeopleOutlinedIcon from '@mui/icons-material/NaturePeopleOutlined';
import PropTypes from 'prop-types';

export const View = ({ user, children }) => {
    const { t } = useTranslation();
    return (
        <Box sx={{ paddingX: 2 }}>
            <Box paddingY={1} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">{t('User Details')} </Typography>
                <Box>
                    <>{children}</>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                <IconUser size={22} />
                <Box sx={{ paddingX: 2 }}>
                    <Typography variant="subtitle1">{user.name} </Typography>
                    <Typography variant="subtitle2">{t('Full name')} </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                <IconMail size={20} />
                <Box sx={{ paddingX: 2 }}>
                    <Typography variant="subtitle1">{user.email} </Typography>
                    <Typography variant="subtitle2">{t('Email address')} </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                <BadgeOutlinedIcon size={18} />
                <Box sx={{ paddingX: 2 }}>
                    <Typography variant="subtitle1">{user.role} </Typography>
                    <Typography variant="subtitle2">{t('Role')} </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                <NaturePeopleOutlinedIcon size={18} />
                <Box sx={{ paddingX: 2 }}>
                    <Typography variant="subtitle1" textTransform={'capitalize'}>
                        {t(user.status)}{' '}
                    </Typography>
                    <Typography variant="subtitle2">{t('Status')} </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginY: 2.6 }}>
                <IconCalendar size={20} />
                <Box sx={{ paddingX: 2 }}>
                    <Typography variant="subtitle1">{DateFormatter(user.created_at)} </Typography>
                    <Typography variant="subtitle2">{t('Created on')} </Typography>
                </Box>
            </Box>
        </Box>
    );
};

View.PropTypes = {
    user: PropTypes.object,
    children: PropTypes.node
};
