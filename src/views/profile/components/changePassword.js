import { useState } from 'react';
import { Box, Divider, Grid, IconButton, Typography, useTheme } from '@mui/material';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import PropTypes from 'prop-types';

const ChangePassword = () => {
    const theme = useTheme();

    const [expand, setExpand] = useState(false);

    return (
        <Grid
            container
            sx={{
                borderRadius: 2,
                border: 1,
                borderColor: theme.palette.grey[300],
                // backgroundColor: theme.palette.grey[100],
                marginBottom: 2
            }}
        >
            <Grid item xs={12}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginY: 2,
                        paddingX: 3
                    }}
                >
                    <Typography variant="h4">Change Password</Typography>
                    <IconButton onClick={() => setExpand(!expand)}>
                        {expand ? <IconChevronDown size={18} /> : <IconChevronUp size={18} />}
                    </IconButton>
                </Box>
                <Divider />
            </Grid>
        </Grid>
    );
};

export default ChangePassword;
