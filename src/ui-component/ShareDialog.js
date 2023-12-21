import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    LinkedinShareButton,
    LinkedinIcon,
    WhatsappShareButton,
    WhatsappIcon,
    TelegramShareButton,
    TelegramIcon
} from 'react-share';
import { useQuery } from 'react-query';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import PropTypes from 'prop-types';

const ShareDialog = ({ open, onClose, session_id }) => {
    const { t } = useTranslation();
    const [metadata, setMetadata] = useState([]);

    const handleSharing = async () => {
        var Api = Connections.api + Connections.sharetraining + session_id;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        fetch(Api, { method: 'GET', headers: headers })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    const data = response.data;
                    setMetadata(data);
                } else {
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                handlePrompts(error.message, 'error');
            });
    };
    const url = metadata['og:url'];
    useQuery(['data', session_id], () => handleSharing());

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(t(message), { variant });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle variant="h4">{t('Share')}</DialogTitle>

            <DialogContent>
                <FacebookShareButton url={url}>
                    <Button variant="text" color="primary">
                        <FacebookIcon size={32} round={true} />
                    </Button>
                </FacebookShareButton>
                <TwitterShareButton url={url}>
                    <Button variant="text" color="primary">
                        <TwitterIcon size={32} round={true} />
                    </Button>
                </TwitterShareButton>
                <LinkedinShareButton url={url}>
                    <Button variant="text" color="primary">
                        <LinkedinIcon size={32} round={true} />
                    </Button>
                </LinkedinShareButton>
                <WhatsappShareButton url={url}>
                    <Button variant="text" color="primary">
                        <WhatsappIcon size={32} round={true} />
                    </Button>
                </WhatsappShareButton>

                <TelegramShareButton url={url}>
                    <Button variant="text" color="primary">
                        <TelegramIcon size={32} round={true} />
                    </Button>
                </TelegramShareButton>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {t('Close')}
                </Button>
            </DialogActions>
            <SnackbarProvider maxSnack={3} />
        </Dialog>
    );
};

ShareDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    session_id: PropTypes.number
};

export default ShareDialog;
