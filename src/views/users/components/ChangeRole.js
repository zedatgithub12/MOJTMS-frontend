import { useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    useTheme
} from '@mui/material';
import { Roles } from 'data/tables/Roles';
import { Close } from '@mui/icons-material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Connections from 'api';

export const ChangeRole = ({ user, onClosePanel }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [role, setRole] = useState(user.role);
    const [changing, setChanging] = useState(false);

    const handleRoleSelection = (event) => {
        setRole(event.target.value);
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(t(message), { variant });
    };

    const ChangeRole = () => {
        setChanging(true);

        var Api = Connections.api + Connections.changerole;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const data = {
            id: user.id,
            role: role
        };

        fetch(Api, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setChanging(false);
                    handlePrompts(response.message, 'success');
                } else {
                    setChanging(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setChanging(false);
                handlePrompts(error.message, 'error');
            });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ marginTop: 2, marginBottom: 1 }}>
                    {t('Change user role')}
                </Typography>
                <IconButton onClick={() => onClosePanel()}>
                    <Close size={18} />
                </IconButton>
            </Box>

            <Divider />
            <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                {user.name}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 1 }}>
                <Typography variant="subtitle2" marginRight={2}>
                    {t('Current role')}:{' '}
                </Typography>
                <Typography variant="subtitle1">{t(user.role)}</Typography>
            </Box>

            <FormControl fullWidth sx={{ ...theme.typography.customInput }} color="primary">
                <InputLabel htmlFor="outlined-adornment-email">{role ? '' : 'Role'}</InputLabel>
                <Select value={role} onChange={(event) => handleRoleSelection(event)}>
                    {Roles.map((role, index) => (
                        <MenuItem key={index} value={role.name}>
                            {t(role.name)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                disableElevation
                disabled={role === user.role ? true : false}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 10 }}
                onClick={() => ChangeRole()}
            >
                {changing ? <CircularProgress size={16} sx={{ color: theme.palette.background.default }} /> : t('Apply')}
            </Button>
            <SnackbarProvider maxSnack={3} style={{ zIndex: 5 }} />
        </Box>
    );
};
ChangeRole.propTypes = {
    open: PropTypes.bool,
    onClosePanel: PropTypes.func
};
