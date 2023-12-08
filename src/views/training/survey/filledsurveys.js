import { useState } from 'react';
import { Box, Button, CircularProgress, Grid, IconButton, TextField, Typography, Divider, TablePagination } from '@mui/material';
import { useQuery } from 'react-query';
import { RefreshToken } from 'utils/token-refresh';
import { FilterPanel } from 'ui-component/FilterPanel';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { NoResult } from 'utils/components/noresult';
import { IconX } from '@tabler/icons';
import { useSelector } from 'react-redux';
import errorImage from 'assets/images/error.jpg';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import Connections from 'api';
import PropTypes from 'prop-types';
import FilledSurveyTable from './components/FilledListing';

const FilledSurveys = ({ training_id }) => {
    const [loading, setLoading] = useState(false);
    const [filledSurveys, setFilledSurveys] = useState([]);

    const [filters, setFilters] = useState({
        round: ''
    });

    const [counts, setCounts] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0
    });

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
    };

    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchFilledSurveys();
        } else {
            FetchFilledSurveys();
        }
    };

    const FetchFilledSurveys = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.filledsurveys + training_id + `?round=${filters.round}`;
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

            setFilledSurveys(data.data);
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
        FetchFilledSurveys();
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

                                <Box sx={{ minHeight: 80, display: 'flex', flexDirection: 'column', marginTop: 3 }}>
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
                </Grid>

                {loading ? (
                    <Grid container>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress size={20} />
                        </Grid>
                    </Grid>
                ) : error ? (
                    <ErrorPrompt
                        image={errorImage}
                        title="Server Error"
                        message="Oooops... There is server error fetching filled surveys"
                    />
                ) : filledSurveys.length === 0 ? (
                    <NoResult title="" message="Oooops... No filled survey found" />
                ) : (
                    <div>
                        <FilledSurveyTable rows={filledSurveys} />
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

FilledSurveys.propTypes = {
    training_id: PropTypes.number
};

export default FilledSurveys;
