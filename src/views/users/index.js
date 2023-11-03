import { useState } from 'react';
// material-ui
import { PersonAdd } from '@mui/icons-material';
import { Grid, Box, Typography, useTheme, Avatar, Divider, ListItemIcon, MenuItem, IconButton, Menu } from '@mui/material';
import { SearchFilterAdd } from './components/SearchFilterAdd';

// project imports
import { PageHeader } from 'ui-component/page-header/PageHeader';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { UserColumn } from 'data/tables/columns/Users';
import { users } from 'data/tables/dummies/users';
import AddUser from './components/AddUser';
import { View } from './components/View';
import { IconDotsVertical } from '@tabler/icons';

// ==============================|| USERS PAGE ||============================== //

const Users = () => {
    const theme = useTheme();
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('Role');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleSearching = () => {
        console.log('searching');
    };

    const handleRoleFilter = (event) => {
        setRole(event.target.value);
    };

    const handleAddUser = () => {
        console.log('add user clicked');
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleUserSelection = (params) => {
        setSelectedUser(params.row);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
            <Grid container sx={{ position: 'relative', zIndex: 4 }}>
                <PageHeader
                    title="Users"
                    back={true}
                    option={false}
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
                        <Typography variant="h3" color={'white'}>
                            Users
                        </Typography>
                    </Box>
                </PageHeader>
            </Grid>

            <SearchFilterAdd
                role={role}
                onRoleChange={(event) => handleRoleFilter(event)}
                searchText={search}
                onTextChange={(event) => setSearch(event.target.value)}
                onSubmit={() => handleSearching()}
                onAddUser={() => handleDialogOpen()}
            />
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={7.8} xl={7.8}>
                    <DataGrid
                        columns={UserColumn}
                        rows={users}
                        slots={{
                            toolbar: GridToolbar
                        }}
                        onRowClick={(params) => handleUserSelection(params)}
                    />
                </Grid>
                {selectedUser && (
                    <Grid item xs={12} sm={12} md={12} lg={4.2} xl={4.2} position={'relative'}>
                        <Box
                            sx={{ position: 'fixed', boxShadow: 1, marginX: 2, padding: 2, borderRadius: 2, minWidth: 400, minHeight: 440 }}
                        >
                            <View user={selectedUser}>
                                <IconButton
                                    id="menu-button"
                                    aria-controls={open ? 'user-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    <IconDotsVertical size={20} />
                                </IconButton>
                                <Menu
                                    id="user-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'menu-button'
                                    }}
                                >
                                    <MenuItem onClick={handleClose}>Change role</MenuItem>
                                    <MenuItem onClick={handleClose}>Update status</MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleClose}>Delete user account</MenuItem>
                                </Menu>
                            </View>
                        </Box>
                    </Grid>
                )}
            </Grid>

            <AddUser open={openDialog} handleDialogClose={() => handleDialogClose()} />
        </Grid>
    );
};

export default Users;
