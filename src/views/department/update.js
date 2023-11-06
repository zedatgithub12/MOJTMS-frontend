import { useState } from 'react';
// material-ui
import { Grid, Box, Typography, useTheme } from '@mui/material';
import { PageHeader } from 'ui-component/page-header/PageHeader';

// ==============================|| UPDATE DEPARTMENT PAGE ||============================== //

const UpdateDepartment = () => {
    const theme = useTheme();

    return (
        <Grid
            container
            sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: theme.palette.primary[200] + 25,
                ':hover': {
                    boxShadow: '0 2px 2px 0 rgb(32 40 45 / 8%)'
                }
            }}
        >
            <PageHeader title="Departments" back={true}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant="h3" color={'white'}>
                        Update Department
                    </Typography>
                </Box>
            </PageHeader>

            <Grid container sx={{ minHeight: 200, padding: 1 }}>
                <Typography variant="body2">Department childrens</Typography>
            </Grid>
        </Grid>
    );
};

export default UpdateDepartment;
