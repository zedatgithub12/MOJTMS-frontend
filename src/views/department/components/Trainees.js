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
import { IconDotsVertical, IconX } from '@tabler/icons';
import { useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import { DateFormatter, calculateAge } from 'utils/functions';
import TraineeTable from './TraineeTable';
import errorImage from 'assets/images/error.jpg';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import Connections from 'api';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import ELevel from 'data/static/ELevel';

const DepartmentTrainees = ({ department_id }) => {
    const [loading, setLoading] = useState(false);
    const [trainees, setTrainees] = useState([]);

    const filterData = useSelector((state) => state.customization.basicinfos);
    const [filters, setFilters] = useState({
        age: '',
        gender: '',
        education: '',
        job_title: ''
    });

    const [counts, setCounts] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    });

    const [exportExcel, setexportExcel] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

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
            Connections.departmentrainees +
            department_id +
            `?age=${filters.age}&gender=${filters.gender}&education=${filters.education}&job_title=${filters.job_title}&page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
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
            setCounts(data.total);
        } else {
            setLoading(false);
        }
    };
    const { error } = useQuery(['data', paginationModel], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

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
            education: '',
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

    const csvData = trainees.map((item) => ({
        Name: item.user_name,
        Email: item.user_email,
        Gender: item.gender,
        Age: calculateAge(item.date_of_birth),
        Phone: item.phone ? item.phone : 'N/A',
        Department: item.dept_name,
        Education_level: item.education_level ? item.education_level : 'N/A',
        Job_title: item.job_title ? item.job_title : 'N/A',
        Added_on: DateFormatter(item.created_at),
        Status: item.user_status
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

    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container sx={{ paddingY: 2 }}>
                    <Grid item xs={12} sm={12} md={6}>
                        <FilterPanel
                            open={open}
                            anchorEl={anchorEl}
                            handleClose={handleClose}
                            filterButton={
                                <Button variant="outlined" startIcon={<SortOutlinedIcon />} onClick={handleMenuClick}>
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

                                <Box sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', marginTop: 1 }}>
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

                                    <FormControl sx={{ marginTop: 3 }}>
                                        <FormLabel component="legend" htmlFor="outlined-adornment-education">
                                            Education
                                        </FormLabel>
                                        <Select
                                            value={filters.education}
                                            onChange={handleFilterChange}
                                            id="outlined-adornment-job-title"
                                            name="education"
                                            sx={{ marginTop: 1 }}
                                        >
                                            <MenuItem value={''}>All</MenuItem>

                                            {ELevel.length == 0 ? (
                                                <Typography variant="body2" sx={{ padding: 1 }}>
                                                    Education level not found
                                                </Typography>
                                            ) : (
                                                ELevel.map((level, index) => (
                                                    <MenuItem key={index} value={level.value}>
                                                        {level.value}
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
                                        marginY: 2
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
                        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 1 }}
                    >
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={expand ? 'long-menu' : undefined}
                            aria-expanded={expand ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <IconDotsVertical size={20} />
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
                    <div>
                        <TraineeTable rows={trainees} />
                        <TablePagination
                            component="div"
                            count={counts}
                            page={paginationModel.page}
                            onPageChange={handleChangePage}
                            rowsPerPage={paginationModel.pageSize}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                )}
            </Grid>
        </Grid>
    );
};

DepartmentTrainees.propTypes = {
    department_id: PropTypes.number
};

export default DepartmentTrainees;
