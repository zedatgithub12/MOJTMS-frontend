import { useState } from 'react';
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
    TablePagination
} from '@mui/material';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { FilterPanel } from 'ui-component/FilterPanel';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { NoResult } from 'utils/components/noresult';
import { IconTableExport, IconX } from '@tabler/icons';
import TraineesTable from './components/TraineesTable';
import errorImage from 'assets/images/error.jpg';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import Connections from 'api';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const TrainingTrainees = ({ training_id }) => {
    const [loading, setLoading] = useState(false);
    const [trainees, setTrainees] = useState([]);

    const filterData = useSelector((state) => state.customization.basicinfos);
    const [filters, setFilters] = useState({
        age: '',
        gender: '',
        department: '',
        job_title: ''
    });

    const [paginationModel, setPaginationModel] = useState({
        counts: 0,
        pageSize: 10,
        page: 0
    });
    const [exportExcel, setexportExcel] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchTrainees();
        } else {
            FetchTrainees();
        }
    };

    const FetchTrainees = async () => {
        setLoading(true);
        var Api =
            Connections.api +
            Connections.trainingtrainees +
            training_id +
            `?age=${filters.age}&gender=${filters.gender}&department=${filters.department}&job_title=${filters.job_title}`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            setLoading(false);
            const data = parsed.data;
            setTrainees(data.data);
            setPaginationModel({ ...paginationModel, counts: data.total });
        } else {
            setLoading(false);
        }
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

    const { error } = useQuery(['data', paginationModel], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    const handleChangePage = (event, newPage) => {
        setPaginationModel({
            ...paginationModel,
            page: newPage
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setPaginationModel({
            ...paginationModel,
            pageSize: parseInt(event.target.value, 10),
            page: 0
        });
    };

    const expand = Boolean(exportExcel);
    const handleClick = (event) => {
        setexportExcel(event.currentTarget);
    };

    //handle generating report in exceel and csv formats
    const csvData =
        selectedRows.length > 0
            ? selectedRows.map((id) => {
                  const item = filteredData.find((item) => item.id === id);
                  return {
                      shop: item.stock_shop,
                      item_name: item.item_name,
                      item_code: item.item_code,
                      category: item.item_category,
                      sub_category: item.item_sub_category,
                      brand: item.item_brand,
                      SKU: item.stock_unit,
                      item_min_quantity: item.stock_min_quantity,
                      item_quantity: item.stock_quantity,
                      item_cost: item.stock_cost,
                      item_price: item.stock_price,
                      item_expire_date: item.stock_expire_date,
                      item_status: item.stock_status
                  };
              })
            : filteredData.map((item) => ({
                  shop: item.stock_shop,
                  item_name: item.item_name,
                  item_code: item.item_code,
                  category: item.item_category,
                  sub_category: item.item_sub_category,
                  brand: item.item_brand,
                  SKU: item.stock_unit,
                  item_min_quantity: item.stock_min_quantity,
                  item_quantity: item.stock_quantity,
                  item_cost: item.stock_cost,
                  item_price: item.stock_price,
                  item_expire_date: item.stock_expire_date,
                  item_status: item.stock_status
              }));

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'stocks');
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });
        const fileData = new Blob([excelBuffer], {
            type: 'application/octet-stream'
        });
        saveAs(fileData, 'stocks.xlsx');
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container sx={{ paddingY: 2 }}>
                    <Grid item xs={12} sm={12} md={6}>
                        <FilterPanel
                            open={open}
                            anchorEl={anchorEl}
                            handleMenuClick={handleMenuClick}
                            handleClose={handleClose}
                            filterButton={
                                <Button variant="outlined" startIcon={<SortOutlinedIcon />}>
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
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 2 }}
                    >
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={expand ? 'long-menu' : undefined}
                            aria-expanded={expand ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <IconTableExport size={18} />
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
                                    maxHeight: 20 * 4.5,
                                    width: '20ch'
                                }
                            }}
                        >
                            <MenuItem onClick={handleDownloadExcel}>Export Excel </MenuItem>
                            <MenuItem>
                                <CSVLink data={csvData} filename={'stocks.csv'} className="text-decoration-none text-dark">
                                    Export CSV
                                </CSVLink>
                            </MenuItem>
                        </Menu>
                    </Grid>
                </Grid>

                {loading ? (
                    <Grid container>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress size={20} />
                        </Grid>
                    </Grid>
                ) : error ? (
                    <ErrorPrompt image={errorImage} title="Server Error" message="Oooops... There is server error fetching trainees" />
                ) : trainees.length === 0 ? (
                    <NoResult title="" message="Oooops... No trainee found" />
                ) : (
                    <TraineesTable rows={trainees} />
                )}

                <TablePagination
                    component="div"
                    count={paginationModel.counts}
                    page={paginationModel.page}
                    onPageChange={handleChangePage}
                    rowsPerPage={paginationModel.pageSize}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
    );
};

TrainingTrainees.propTypes = {
    training_id: PropTypes.number
};

export default TrainingTrainees;
