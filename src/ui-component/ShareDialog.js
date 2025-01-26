import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme, Typography, IconButton, Grid } from '@mui/material';
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
import { useTranslation } from 'react-i18next';
import { IconCopy } from '@tabler/icons';
import { Box } from '@mui/system';
import Connections from 'api';
import PropTypes from 'prop-types';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

const ShareDialog = ({ open, onClose, session_id }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const url = Connections.url + 'training/shared/' + session_id;

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            enqueueSnackbar('link copied to clipboard!', 'info');
        } catch (error) {
            enqueueSnackbar('Failed to copy URL to clipboard', 'error');
        }
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

            <Grid container>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box
                        sx={{
                            width: '86%',
                            alignSelf: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginY: 2,
                            padding: 1,
                            border: 1,
                            borderRadius: 2,
                            borderColor: theme.palette.primary[200],
                            backgroundColor: theme.palette.primary.light
                        }}
                        onClick={() => handleCopyToClipboard()}
                    >
                        <Typography variant="body2" color="primary">
                            {url}
                        </Typography>
                        <Box>
                            <IconButton>
                                <IconCopy size={18} />
                            </IconButton>
                            <Typography variant="subtitle2">copy</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
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
