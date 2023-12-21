import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import DialogTypes from 'data/static/dialogTypes';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';

export const Delete = ({ type, open, title, description, handleClose, onNo, onYes, deleting }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const Icon = DialogTypes.find((types) => types.name == type);
    return (
        <React.Fragment>
            <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 2 }}>
                    {Icon && Icon.icon}
                    <DialogTitle variant="h5" color="grey" id="responsive-dialog-title">
                        {t(title)}
                    </DialogTitle>
                </Box>

                <DialogContent>
                    <DialogContentText variant="body1">{t(description)}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onNo} color="dark">
                        {t('No')}
                    </Button>
                    <Button onClick={onYes} color="error">
                        {deleting ? <CircularProgress size={16} sx={{ color: theme.palette.error.main }} /> : t('Yes')}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

Delete.propTypes = {
    type: PropTypes.string,
    open: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    handleClose: PropTypes.func,
    onNo: PropTypes.func,
    onYes: PropTypes.func,
    deleting: PropTypes.bool
};
