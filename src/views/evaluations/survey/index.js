import { useEffect, useState } from 'react';
// material-ui
import { Grid, useTheme, Pagination, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
// project imports
import { useLocation, useNavigate } from 'react-router';
import { MediumHeader } from 'ui-component/page-header/mediumHeader';
import { useQuery } from 'react-query';
import { SearchFilterAdd } from 'ui-component/search-add';
import { RefreshToken } from 'utils/token-refresh';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { NoResult } from 'utils/components/noresult';
import { useTranslation } from 'react-i18next';
import SplitButton from 'ui-component/Buttons/SplitButton';
import Connections from 'api';
import noresult from 'assets/images/no_result.png';
import SurveyCard from './components/surveyCard';
import CheckPathPermission from 'utils/path-checker';

// ==============================|| SURVEY PAGE ||============================== //

const SurveyStatus = ['draft', 'active', 'archived'];

const Survey = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const isAllowedPath = CheckPathPermission(path);
        if (!isAllowedPath) {
            navigate('/');
        }
        return () => {};
    }, []);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('active');
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [rowCount, setRowCount] = useState(1);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
        page: 1
    });

    const handleDataFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            setRefreshed(true);
            fetchSurveys();
        } else {
            fetchSurveys();
        }
    };

    const fetchSurveys = async () => {
        setLoading(false);
        var Api =
            Connections.api + Connections.surveys + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&status=${status}`;
        const token = sessionStorage.getItem('token');
        var headers = {
            Authorization: `Bearer` + token,
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await fetch(Api, { method: 'GET', headers: headers });
        const parsed = await response.json();
        if (parsed.success) {
            const data = parsed.data.data;
            const totalrows = parsed.data.total;
            const lastPage = parsed.data.last_page;

            setData(data);
            setRowCount(totalrows);
            setLastPage(lastPage);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const { error } = useQuery(['data', paginationModel, status], () => handleDataFetching(), {
        refetchOnWindowFocus: false
    });

    const handleSearching = () => {
        setSearching(true);
        var Api =
            Connections.api + Connections.surveysearch + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&query=${search}`;

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
                    setData(response.data.data);
                } else {
                    setSearching(false);
                }
            })
            .catch((error) => {
                setSearching(false);
                handlePrompts(error, 'error');
            });
    };

    const handleChange = (event, value) => {
        setPaginationModel({
            ...paginationModel,
            page: value
        });
    };

    //handle status change
    const handleStatusChange = (index) => {
        const selectedStatus = SurveyStatus[index];
        setSelectedIndex(index);
        setStatus(selectedStatus);
    };

    return (
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
            }}
        >
            <Grid
                item
                xs={11}
                sm={10}
                md={10}
                lg={8}
                xl={8}
                sx={{
                    marginBottom: 2,
                    minHeight: '45vh',
                    borderRadius: 2,
                    border: '1px solid',
                    background: theme.palette.primary.light,
                    borderColor: theme.palette.primary[200]
                }}
            >
                <MediumHeader
                    title="Surveys"
                    back={true}
                    option={false}
                    sx={{ background: `linear-gradient(to left, ${theme.palette.secondary.light}, ${theme.palette.primary[200]})` }}
                />
                <SearchFilterAdd
                    searchText={search}
                    searching={searching}
                    onTextChange={(event) => setSearch(event.target.value)}
                    onSubmit={() => handleSearching()}
                    addTitle="Create Survey"
                    onAdd={() => navigate('/survey/create')}
                />

                <Box sx={{ padding: 2 }}>
                    <SplitButton
                        options={SurveyStatus}
                        onPress={(event, index) => handleStatusChange(index)}
                        selectedIndex={selectedIndex}
                    />

                    {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                            <CircularProgress size={22} />
                        </Box>
                    ) : error ? (
                        <ErrorPrompt image={noresult} title="Server Error" message="Oooops... unable to fetch the surveys!" />
                    ) : data.length === 0 ? (
                        <NoResult image={noresult} title="" message="Oooops... No survey found!" />
                    ) : (
                        <div>
                            {data.map((item) => (
                                <SurveyCard
                                    key={item.id}
                                    title={item.title}
                                    description={item.description}
                                    onClick={() => navigate('/survey/view', { state: item })}
                                    status={item.status}
                                    sx={{}}
                                />
                            ))}
                            {rowCount > paginationModel.pageSize && (
                                <Box sx={{ paddingY: 4 }}>
                                    <Pagination
                                        showFirstButton
                                        showLastButton
                                        count={lastPage}
                                        page={paginationModel.page}
                                        onChange={handleChange}
                                    />
                                </Box>
                            )}
                        </div>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};

export default Survey;
