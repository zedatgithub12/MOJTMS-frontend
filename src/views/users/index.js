import { useState } from 'react';
// material-ui
import { Grid, Box, Typography, useTheme, Divider, MenuItem, IconButton, Menu, CircularProgress } from '@mui/material';
import { SearchFilterAdd } from './components/SearchFilterAdd';

// project imports
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { View } from './components/View';
import { IconDotsVertical } from '@tabler/icons';
import { UserColumn } from 'data/tables/columns/Users';
import { ChangeRole } from './components/ChangeRole';
import { UpdateStatus } from './components/UpdateStatus';
import { Delete } from 'ui-component/delete/Delete';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { MediumHeader } from 'ui-component/page-header/mediumHeader';
import { useTranslation } from 'react-i18next';
import AddUser from './components/AddUser';
import Connections from 'api';

// ==============================|| USERS PAGE ||============================== //

const Users = () => {
    const { t } = useTranslation();
    const theme = useTheme();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [rolePanel, setRolePanel] = useState(false);
    const [statusPanel, setStatusPanel] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [rowCountState] = useState(lastPage);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 15,
        page: 0,
        pageCount: 0,
        pageStartIndex: 0,
        pageEndIndex: 0
    });

    const FetchUsers = async () => {
        var Api = Connections.api + Connections.users + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            setLastPage(parsed.data.last_page);
            const data = parsed.data.data;
            setUsers(data);
        }
    };

    const { isLoading, error } = useQuery(['data', paginationModel], () => FetchUsers(), {
        refetchOnWindowFocus: false
    });

    const handleSearching = () => {
        setSearching(true);
        var Api =
            Connections.api + Connections.searchuser + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&name=${search}`;
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
                    setSearching(false);
                    setUsers(response.data.data);
                } else {
                    setSearching(false);
                }
            })
            .catch((error) => {
                setSearching(false);
                handlePrompts(error, 'error');
            });
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

    const DeleteUser = () => {
        setDeleting(true);

        var Api = Connections.api + Connections.users + '/' + selectedUser.id;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        fetch(Api, {
            method: 'DELETE',
            headers: headers
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setDeleting(false);
                    setDeleteUser(false);
                    handlePrompts(response.message, 'success');
                } else {
                    setDeleting(false);
                    handlePrompts(response.message, 'error');
                }
            })
            .catch((error) => {
                setDeleting(false);
                handlePrompts(error.message, 'error');
            });
    };

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(t(message), { variant });
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
                <MediumHeader
                    title="Users"
                    back={true}
                    option={false}
                    sx={{ background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})` }}
                />
            </Grid>

            <SearchFilterAdd
                searchText={search}
                searching={searching}
                onTextChange={(event) => setSearch(event.target.value)}
                onSubmit={() => handleSearching()}
                onAddUser={() => handleDialogOpen()}
            />
            <Grid container>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={7.8}
                    xl={7.8}
                    sx={{
                        minHeight: 300,
                        minWidth: 300,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {error ? (
                        <Box>
                            <Typography>{t('There is error rendering users')}</Typography>
                        </Box>
                    ) : isLoading ? (
                        <CircularProgress size={24} />
                    ) : (
                        users && (
                            <DataGrid
                                columns={UserColumn}
                                rows={users}
                                slots={{
                                    toolbar: GridToolbar
                                }}
                                onRowClick={(params) => handleUserSelection(params)}
                                sx={{ padding: 2 }}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: paginationModel.pageSize,
                                            pageCount: lastPage,
                                            pageEndIndex: lastPage
                                        }
                                    }
                                }}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                pagination={true}
                                rowCount={rowCountState}
                                pageSizeOptions={[15, 25, 50, 100]}
                                onPageChange={(newPage) => {
                                    setPaginationModel({
                                        ...paginationModel,
                                        page: newPage
                                    });
                                }}
                                onPageSizeChange={(newPageSize) => {
                                    setPaginationModel({
                                        ...paginationModel,
                                        pageSize: newPageSize
                                    });
                                }}
                                hideFooterSelectedRowCount={true}
                            />
                        )
                    )}
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
                                    <MenuItem
                                        onClick={() => {
                                            setStatusPanel(false), setRolePanel(true), setAnchorEl(false);
                                        }}
                                    >
                                        {t('Change role')}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            setRolePanel(false), setStatusPanel(true), setAnchorEl(false);
                                        }}
                                    >
                                        {t('Update status')}
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem
                                        onClick={() => {
                                            setDeleteUser(true), setAnchorEl(false);
                                        }}
                                    >
                                        {t('Delete user account')}
                                    </MenuItem>
                                </Menu>
                            </View>
                        </Box>
                    </Grid>
                )}
            </Grid>

            <AddUser open={openDialog} handleDialogClose={() => handleDialogClose()} onRefresh={() => FetchUsers()} />
            {selectedUser && rolePanel && (
                <Box
                    sx={{
                        minWidth: 400,
                        minHeight: 340,
                        position: 'fixed',
                        bottom: 20,
                        right: 15,
                        background: theme.palette.background.default,
                        boxShadow: 1,
                        paddingX: 3,
                        paddingY: 1,
                        borderRadius: 4
                    }}
                >
                    <ChangeRole user={selectedUser} onClosePanel={() => setRolePanel(false)} />
                </Box>
            )}

            {selectedUser && statusPanel && (
                <Box
                    sx={{
                        minWidth: 400,
                        minHeight: 340,
                        position: 'fixed',
                        bottom: 20,
                        right: 15,
                        background: theme.palette.background.default,
                        boxShadow: 1,
                        paddingX: 3,
                        paddingY: 1,
                        borderRadius: 4
                    }}
                >
                    <UpdateStatus user={selectedUser} onClosePanel={() => setStatusPanel(false)} />
                </Box>
            )}

            {deleteUser && (
                <Delete
                    open={deleteUser}
                    title="Deleting user account"
                    description={t(`Are you sure you want to delete `) + selectedUser.name}
                    onNo={() => setDeleteUser(false)}
                    onYes={() => DeleteUser()}
                    deleting={deleting}
                    handleClose={() => setDeleteUser(false)}
                />
            )}

            <SnackbarProvider maxSnack={3} style={{ zIndex: 5 }} />
        </Grid>
    );
};

export default Users;
