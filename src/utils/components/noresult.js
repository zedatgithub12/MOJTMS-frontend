import { Button, Grid, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import noresult from 'assets/images/no_result.png';

export const NoResult = ({ image, title, message, buttontitle, onPress }) => {
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
                    {title}
                </Typography>
                <Typography variant="subtitle2"> {message} </Typography>
                {buttontitle && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onPress}
                        sx={{ padding: 1, paddingX: 5, marginTop: 4, borderRadius: 20 }}
                    >
                        {buttontitle}
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};

NoResult.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    buttontitle: PropTypes.string,
    onPress: PropTypes.func
};
