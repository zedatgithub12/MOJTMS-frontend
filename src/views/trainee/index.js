import { useState } from 'react';
// material-ui
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    TextField,
    Typography,
    FormControl,
    FormLabel,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Select,
    Menu,
    MenuItem,
    TablePagination,
    useTheme
} from '@mui/material';
import { SearchFilterAdd } from './components/SearchFilterAdd';
// project imports
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import ExcelJS from 'exceljs';
import AddTrainee from './components/AddTrainee';
import { ChangeRole } from './components/ChangeRole';
import { UpdateStatus } from './components/UpdateStatus';
import { Delete } from 'ui-component/delete/Delete';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import Connections from 'api';
import { useQuery } from 'react-query';
import { MediumHeader } from 'ui-component/page-header/mediumHeader';
import { useNavigate } from 'react-router';
import { FilterPanel } from 'ui-component/FilterPanel';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import { useSelector } from 'react-redux';
import { IconDotsVertical, IconTableExport, IconX } from '@tabler/icons';
import { DateFormatter, calculateAge } from 'utils/functions';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import TraineesTable from './components/TraineesTable';

// ==============================|| TRAINEE DETAIL PAGE ||============================== //

const Trainee = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [rolePanel, setRolePanel] = useState(false);
    const [statusPanel, setStatusPanel] = useState(false);
    const [deleteUser, setDeleteUser] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [lastPage, setLastPage] = useState(1);
    const [counts, setCounts] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    });
    const filterData = useSelector((state) => state.customization.basicinfos);
    const [filters, setFilters] = useState({
        round: '',
        age: '',
        gender: '',
        department: '',
        job_title: ''
    });

    const [exportExcel, setexportExcel] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const FetchUsers = async () => {
        setLoading(true);
        const department = '';
        var Api =
            Connections.api +
            Connections.trainee +
            `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&department=${department}`;
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
            setCounts(parsed.data.total);

            const data = parsed.data.data;
            setUsers(data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useQuery(['data', paginationModel], () => FetchUsers(), {
        refetchOnWindowFocus: false
    });

    const handleSearching = () => {
        setSearching(true);
        var Api =
            Connections.api + Connections.searchtrainee + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&query=${search}`;
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

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAnchorEl(null);
        setexportExcel(null);
    };

    const handleUserSelection = (params) => {
        setSelectedUser(params.row);
        navigate('/trainee/details', { state: params.row });
    };

    const userStatusIndicator = (status) => {
        var text;
        var color;

        if (status == 'active') {
            text = 'Active';
            color = '#b9f6ca';
        } else if (status == 'pending') {
            text = 'Pending';
            color = '#CDD5DF';
        } else {
            text = 'Suspended';
            color = '#ffab91';
        }

        return { text, color };
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleClear = (name) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: ''
        }));
    };

    const handleApplyingFilter = () => {
        handleClose();
        FetchTrainees();
    };

    const handleReset = () => {
        setFilters({
            age: '',
            gender: '',
            department: '',
            job_title: ''
        });
    };

    //handle the page change of the trainee listing table
    const handleChangePage = (event, newPage) => {
        setPaginationModel({
            ...paginationModel,
            page: newPage
        });
    };

    //handle the page size or row count number of the listing table
    const handleChangeRowsPerPage = (event) => {
        setPaginationModel({
            ...paginationModel,
            pageSize: parseInt(event.target.value, 10),
            page: 0
        });
    };

    //handle generating report in exceel and csv formats
    const expand = Boolean(exportExcel);
    const handleClick = (event) => {
        setexportExcel(event.currentTarget);
    };

    const csvData = users.map((data) => ({
        name: data.user ? data.user.name : 'N/A',
        department: data.department ? data.department.name : 'N/A',
        email: data.user ? data.user.email : 'N/A',
        gender: data.gender || 'N/A',
        age: calculateAge(data.date_of_birth),
        address: data.address || 'N/A',
        phone: data.phone || 'N/A',
        status: data.user ? data.user.status : 'N/A'
    }));

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'trainees');
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });
        const fileData = new Blob([excelBuffer], {
            type: 'application/octet-stream'
        });
        saveAs(fileData, 'trainees.xlsx');
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
                    sx={{ background: `linear-gradient(to left, ${theme.palette.secondary.light}, ${theme.palette.primary[200]})` }}
                />
            </Grid>

            <SearchFilterAdd
                searchText={search}
                searching={searching}
                onTextChange={(event) => setSearch(event.target.value)}
                onSubmit={() => handleSearching()}
                onAddUser={() => handleDialogOpen()}
                exportingComponent={
                    <div>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={expand ? 'long-menu' : undefined}
                            aria-expanded={expand ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            sx={{ marginLeft: 1 }}
                        >
                            <IconDotsVertical size={22} />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button'
                            }}
                            anchorEl={exportExcel}
                            open={expand}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: 30 * 4.5,
                                    width: '20ch'
                                }
                            }}
                        >
                            <MenuItem onClick={handleDownloadExcel}>
                                <Typography variant="body1">Excel Export</Typography>
                            </MenuItem>
                            <MenuItem>
                                <CSVLink data={csvData} filename={'trainees.csv'} style={{ textDecoration: 'none' }}>
                                    <Typography variant="body1">CSV Export</Typography>
                                </CSVLink>
                            </MenuItem>
                        </Menu>
                    </div>
                }
            >
                <FilterPanel
                    open={open}
                    anchorEl={anchorEl}
                    handleClose={handleClose}
                    filterButton={
                        <Button
                            variant="outlined"
                            startIcon={<SortOutlinedIcon />}
                            onClick={handleMenuClick}
                            sx={{ paddingY: 1, paddingX: 2 }}
                        >
                            Filter
                        </Button>
                    }
                >
                    <Box sx={{ minWidth: 340, paddingX: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h4">Filter Data</Typography>
                            <IconButton onClick={() => handleClose()}>
                                <IconX size={20} />
                            </IconButton>
                        </Box>

                        <Divider />

                        <Box sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', marginTop: 3 }}>
                            <TextField
                                name="round"
                                value={filters.round}
                                onChange={handleFilterChange}
                                label="Round"
                                InputProps={{
                                    endAdornment: filters.round && (
                                        <IconButton onClick={() => handleClear('round')}>
                                            <IconX size={18} />
                                        </IconButton>
                                    )
                                }}
                            />

                            <TextField
                                name="age"
                                value={filters.age}
                                onChange={handleFilterChange}
                                label="Age, Above"
                                InputProps={{
                                    endAdornment: filters.age && (
                                        <IconButton onClick={() => handleClear('age')}>
                                            <IconX size={18} />
                                        </IconButton>
                                    )
                                }}
                                sx={{ marginTop: 3 }}
                            />

                            <FormControl component="fieldset" sx={{ marginTop: 3, paddingLeft: 1 }}>
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup
                                    aria-label="gender"
                                    name="gender"
                                    value={filters.gender}
                                    onChange={handleFilterChange}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FormControlLabel value="" control={<Radio />} label="All" />
                                    <FormControlLabel value="male" control={<Radio />} label="Males" />
                                    <FormControlLabel value="female" control={<Radio />} label="Females" />
                                </RadioGroup>
                            </FormControl>

                            <FormControl sx={{ marginTop: 3 }}>
                                <FormLabel component="legend">Department</FormLabel>
                                <Select
                                    value={filters.department}
                                    onChange={handleFilterChange}
                                    id="outlined-adornment-job-title"
                                    name="department"
                                    sx={{ marginTop: 1 }}
                                >
                                    <MenuItem value={''}>All</MenuItem>

                                    {filterData.departments && filterData.departments.length == 0 ? (
                                        <Typography variant="body2" sx={{ padding: 1 }}>
                                            Job titles not found
                                        </Typography>
                                    ) : (
                                        filterData.departments &&
                                        filterData.departments.map((position, index) => (
                                            <MenuItem key={index} value={position}>
                                                {position}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>

                            <FormControl sx={{ marginY: 3 }}>
                                <FormLabel component="legend" htmlFor="outlined-adornment-job-title">
                                    Job Title
                                </FormLabel>
                                <Select
                                    value={filters.job_title}
                                    onChange={handleFilterChange}
                                    id="outlined-adornment-job-title"
                                    name="job_title"
                                    sx={{ marginTop: 1 }}
                                >
                                    <MenuItem value={''}>All</MenuItem>

                                    {filterData.job_titles && filterData.job_titles.length == 0 ? (
                                        <Typography variant="body2" sx={{ padding: 1 }}>
                                            Job titles not found
                                        </Typography>
                                    ) : (
                                        filterData.job_titles &&
                                        filterData.job_titles.map((position, index) => (
                                            <MenuItem key={index} value={position}>
                                                {position}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                marginTop: 1
                            }}
                        >
                            <Button variant="text" color="primary" sx={{ marginRight: 2 }} onClick={() => handleReset()}>
                                Reset
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ minWidth: 120, paddingX: 1 }}
                                onClick={() => handleApplyingFilter()}
                            >
                                Apply
                            </Button>
                        </Box>
                    </Box>
                </FilterPanel>
            </SearchFilterAdd>

            <Grid container>
                <Grid item xs={12}>
                    <TraineesTable rows={users} isLoading={loading} />
                    <TablePagination
                        component="div"
                        count={counts}
                        page={paginationModel.page}
                        onPageChange={handleChangePage}
                        rowsPerPage={paginationModel.pageSize}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
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
