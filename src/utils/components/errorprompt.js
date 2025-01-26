import { Button, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import React from 'react';
import PropTypes from 'prop-types';

export const ErrorPrompt = ({ image, title, message, buttontitle, onPress }) => {
    const { t } = useTranslation();
    return (
        <Grid container>
            <Grid
                item
                xs={12}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingY: 4,
                    borderRadius: 4
                }}
            >
                <img src={image} alt="No result found" width="240px" height="240px" />
                <Typography variant="h3" marginY={0.5}>
                    {t(title)}
                </Typography>
                <Typography variant="subtitle2"> {t(message)} </Typography>
                {buttontitle && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onPress}
                        sx={{ padding: 1, paddingX: 5, marginTop: 4, borderRadius: 20 }}
                    >
                        {t(buttontitle)}
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};

ErrorPrompt.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    buttontitle: PropTypes.string,
    onPress: PropTypes.func
};
