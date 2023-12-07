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
    MenuItem
} from '@mui/material';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { FilterPanel } from 'ui-component/FilterPanel';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { NoResult } from 'utils/components/noresult';
import { IconX } from '@tabler/icons';
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

    const { error } = useQuery(['data'], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

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
                                            <FormControlLabel value="" control={<Radio />} label="Both" />
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
                        <Box>
                            <Typography variant="body2">Rows</Typography>
                        </Box>
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
            </Grid>
        </Grid>
    );
};

TrainingTrainees.propTypes = {
    training_id: PropTypes.number
};

export default TrainingTrainees;
