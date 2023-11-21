import { useState } from 'react';
// material-ui
import { PersonAdd } from '@mui/icons-material';
import { Grid, Box, Typography, useTheme, Divider, MenuItem, IconButton, Menu, CircularProgress } from '@mui/material';
import { SearchFilterAdd } from './components/SearchFilterAdd';

// project imports
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs/dist/es5/exceljs.browser';
import AddTrainee from './components/AddTrainee';
import { ChangeRole } from './components/ChangeRole';
import { UpdateStatus } from './components/UpdateStatus';
import { Delete } from 'ui-component/delete/Delete';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import Connections from 'api';
import { useQuery } from 'react-query';
import { MediumHeader } from 'ui-component/page-header/mediumHeader';

// ==============================|| TRAINEES PAGE ||============================== //

const Trainee = () => {
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
        var Api = Connections.api + Connections.trainee + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
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
            Connections.api + Connections.searchtrainee + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&name=${search}`;
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

    const DeleteUser = () => {
        setDeleting(true);

        var Api = Connections.api + Connections.trainee + '/' + selectedUser.id;
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

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'department', headerName: 'Department', width: 200 },
        { field: 'email', headerName: 'Email Address', width: 200 },
        { field: 'gender', headerName: 'Gender', width: 100 },
        { field: 'age', headerName: 'Age', width: 100 },
        { field: 'address', headerName: 'Address', width: 200 },
        { field: 'phone', headerName: 'Phone Number', width: 150 },
        { field: 'status', headerName: 'Status', width: 120 }
    ];

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) {
            return 'N/A';
        }

        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const rows = users.map((data) => ({
        id: data.id,
        name: data.user.name,
        department: data.department.name,
        email: data.user.email,
        gender: data.gender || 'N/A',
        age: calculateAge(data.date_of_birth),
        address: data.address || 'N/A',
        phone: data.phone || 'N/A',
        status: data.user.status
    }));

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
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
            <Grid container sx={{ position: 'relative', zIndex: 4, marginBottom: 1 }}>
                <MediumHeader
                    title="Trainees"
                    back={true}
                    option={false}
                    sx={{ background: `linear-gradient(to left, ${theme.palette.primary[200]}, ${theme.palette.primary.main})` }}
                />
            </Grid>

            <SearchFilterAdd
                searchText={search}
                searching={searching}
                onTextChange={(event) => setSearch(event.target.value)}
                onSubmit={() => handleSearching()}
                onAddUser={() => handleDialogOpen()}
            />
            <Grid container sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 1 }}>
                <Grid item xs={12} sm={12} md={12} sx={{}}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: theme.palette.secondary.light,
                            padding: 2,
                            borderRadius: 2
                        }}
                    >
                        <Typography variant="body2">Sort A-Z</Typography>
                    </Box>
                    <Typography variant="h1">Trainees</Typography>

                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            checkboxSelection
                            pagination
                            pageSize={10}
                            rowsPerPageOptions={[10, 25, 50]}
                            disableSelectionOnClick
                            density="comfortable"
                        />
                    </div>
                </Grid>
            </Grid>

            {openDialog && <AddTrainee open={openDialog} handleDialogClose={() => handleDialogClose()} />}
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
                    description={`Are you sure you want to delete ` + selectedUser.name}
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

export default Trainee;
