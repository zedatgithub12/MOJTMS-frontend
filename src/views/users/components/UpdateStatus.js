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
import { Close } from '@mui/icons-material';
import { Status } from 'data/tables/Status';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import PropTypes from 'prop-types';

export const UpdateStatus = ({ user, onClosePanel }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [status, setStatus] = useState(user.status);
    const [updating, setUpdating] = useState(false);

    const handleRoleSelection = (event) => {
        setStatus(event.target.value);
    };
    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const UpdateStatus = () => {
        setUpdating(true);

        var Api = Connections.api + Connections.updatestatus;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const data = {
            id: user.id,
            status: status
        };

        fetch(Api, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setUpdating(false);
                    handlePrompts(response.message, 'success');
                } else {
                    setUpdating(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setUpdating(false);
                handlePrompts(error.message, 'error');
            });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ marginTop: 2, marginBottom: 1 }}>
                    {t('Update user status')}
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
                    {t('Current status')}:{' '}
                </Typography>
                <Typography variant="subtitle1">{t(user.status)}</Typography>
            </Box>

            <FormControl fullWidth sx={{ ...theme.typography.customInput }} color="primary">
                <InputLabel htmlFor="outlined-adornment-email">{status ? '' : t('Status')}</InputLabel>
                <Select value={status} onChange={(event) => handleRoleSelection(event)}>
                    {Status.map((status, index) => (
                        <MenuItem key={index} value={status.name}>
                            {t(status.name)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                disableElevation
                disabled={status === user.status ? true : false}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 10 }}
                onClick={() => UpdateStatus()}
            >
                {updating ? <CircularProgress size={16} sx={{ color: theme.palette.background.default }} /> : t('Apply')}
            </Button>
            <SnackbarProvider maxSnack={3} style={{ zIndex: 5, overflow: 'hidden' }} />
        </Box>
    );
};
UpdateStatus.propTypes = {
    open: PropTypes.bool,
    onClosePanel: PropTypes.func
};
