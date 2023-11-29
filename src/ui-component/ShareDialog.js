import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {
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

const ShareDialog = ({ open, onClose, url, title, description, image }) => {
    const ShareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, 'Share on Facebook', 'width=800,height=400');
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <Helmet>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta property="og:url" content={url} />
            </Helmet>

            <DialogTitle variant="h4">Share</DialogTitle>
            <DialogContent>
                <Button variant="text" color="primary" onClick={() => ShareOnFacebook()}>
                    <FacebookIcon size={32} round={true} />
                </Button>

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
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareDialog;
