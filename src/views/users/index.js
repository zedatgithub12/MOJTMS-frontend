// material-ui
import { PersonAdd } from '@mui/icons-material';
import { Grid, Box, Typography, useTheme, Avatar, Divider, ListItemIcon, MenuItem } from '@mui/material';
import DepartmentCard from 'ui-component/cards/DepartmentCard';
import MainCard from 'ui-component/cards/MainCard';

// project imports
import { PageHeader } from 'ui-component/page-header/PageHeader';

// ==============================|| USERS PAGE ||============================== //

const Users = () => {
    const theme = useTheme();
    return (
        <MainCard
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
            <PageHeader
                back={true}
                option={true}
                optionChildrens={
                    <>
                        <MenuItem>
                            <Avatar /> Profile
                        </MenuItem>
                        <Divider />
                        <MenuItem>
                            <ListItemIcon>
                                <PersonAdd fontSize="small" />
                            </ListItemIcon>
                            Add another account
                        </MenuItem>
                    </>
                }
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant="h3">Users</Typography>
                </Box>
            </PageHeader>
        </MainCard>
    );
};

export default Users;
