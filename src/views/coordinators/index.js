import { useState } from 'react';
// material-ui
import {
    Box,
    Button,
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
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { MediumHeader } from 'ui-component/page-header/mediumHeader';
import { FilterPanel } from 'ui-component/FilterPanel';
import { useSelector } from 'react-redux';
import { IconDotsVertical, IconX } from '@tabler/icons';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import Connections from 'api';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import CoordinatorTable from './components/CoordinatorTable.js';
import AddCoordinator from './components/AddCoordinator';

// ==============================|| COORDINATOR LISTING PAGE ||============================== //

const Coordinators = () => {
    const { t } = useTranslation();
    const theme = useTheme();

    const [loading, setLoading] = useState(false);
    const [coordinators, setCoordinators] = useState([]);
    const [counts, setCounts] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    });

    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [filters, setFilters] = useState({
        gender: '',
        address: ''
    });

    const [exportExcel, setexportExcel] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const FetchCoordinators = async () => {
        setLoading(true);

        var Api =
            Connections.api +
            Connections.coordinators +
            `?gender=${filters.gender}&address=${filters.address}&page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            setCounts(parsed.data.total);

            const data = parsed.data.data;
            setCoordinators(data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const { error } = useQuery(['data', paginationModel], () => FetchCoordinators(), {
        refetchOnWindowFocus: false
    });

    const handleSearching = () => {
        setSearching(true);
        var Api =
            Connections.api +
            Connections.coordinators +
            '/search' +
            `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&query=${search}`;
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
                    setCoordinators(response.data.data);
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
        FetchCoordinators();
    };

    const handleReset = () => {
        setFilters({
            gender: '',
            department: '',
            job_title: ''
        });
        FetchCoordinators();
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

    const csvData = coordinators.map((data) => ({
        Name: data.user ? data.user.name : 'N/A',
        Department: data.department ? data.department.name : 'N/A',
        Email: data.user ? data.user.email : 'N/A',
        Gender: data.gender || 'N/A',
        Address: data.address || 'N/A',
        Phone: data.phone || 'N/A',
        Status: data.user ? data.user.status : 'N/A'
    }));

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'coordinator');
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });
        const fileData = new Blob([excelBuffer], {
            type: 'application/octet-stream'
        });
        saveAs(fileData, 'coordinator.xlsx');
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
            <Grid container sx={{ position: 'relative', zIndex: 4, marginBottom: 1 }}>
                <MediumHeader
                    title="Coordinators"
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
                                <Typography variant="body1">{t('Excel Export')}</Typography>
                            </MenuItem>
                            <MenuItem>
                                <CSVLink data={csvData} filename={'coordinators.csv'} style={{ textDecoration: 'none' }}>
                                    <Typography variant="body1">{t('CSV Export')}</Typography>
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
                            {t('Filter')}
                        </Button>
                    }
                >
                    <Box sx={{ minWidth: 340, paddingX: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h4">{t('Filter Data')}</Typography>
                            <IconButton onClick={() => handleClose()}>
                                <IconX size={20} />
                            </IconButton>
                        </Box>

                        <Divider />

                        <Box sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', marginTop: 1.6 }}>
                            <FormControl component="fieldset" sx={{ marginTop: 1, paddingLeft: 1 }}>
                                <FormLabel component="legend">{t('Gender')}</FormLabel>
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
                                    <FormControlLabel value="" control={<Radio />} label={t('All')} />
                                    <FormControlLabel value="male" control={<Radio />} label={t('Males')} />
                                    <FormControlLabel value="female" control={<Radio />} label={t('Females')} />
                                </RadioGroup>
                            </FormControl>

                            <FormLabel component="legend" id="address" htmlFor="address" sx={{ marginTop: 3 }}>
                                {t('Address')}
                            </FormLabel>
                            <TextField
                                name="address"
                                value={filters.address}
                                onChange={handleFilterChange}
                                InputProps={{
                                    endAdornment: filters.address && (
                                        <IconButton onClick={() => handleClear('address')}>
                                            <IconX size={18} />
                                        </IconButton>
                                    )
                                }}
                                sx={{ marginTop: 1 }}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                marginTop: 4,
                                marginBottom: 2
                            }}
                        >
                            <Button variant="text" color="primary" sx={{ marginRight: 2 }} onClick={() => handleReset()}>
                                {t('Reset')}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ minWidth: 120, paddingX: 1 }}
                                onClick={() => handleApplyingFilter()}
                            >
                                {t('Apply')}
                            </Button>
                        </Box>
                    </Box>
                </FilterPanel>
            </SearchFilterAdd>

            <Grid container>
                <Grid item xs={12}>
                    <CoordinatorTable rows={coordinators} isLoading={loading} error={error} />
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
            {openDialog && <AddCoordinator open={openDialog} handleDialogClose={() => handleDialogClose()} />}

            <SnackbarProvider maxSnack={3} style={{ zIndex: 5 }} />
        </Grid>
    );
};

export default Coordinators;
