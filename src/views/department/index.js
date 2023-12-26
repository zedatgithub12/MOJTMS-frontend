import { useEffect, useState } from 'react';
// material-ui
import { Grid, Box, useTheme, Pagination, CircularProgress } from '@mui/material';
// project imports
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router';
import { SearchFilterAdd } from 'ui-component/search-add';
import { RefreshToken } from 'utils/token-refresh';
import { MediumHeader } from 'ui-component/page-header/mediumHeader';
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { useTranslation } from 'react-i18next';
import Connections from 'api';
import DepartmentCard from 'ui-component/cards/DepartmentCard';
import noresult from 'assets/images/no_result.png';
import CheckPathPermission from 'utils/path-checker';

// ==============================|| DEPARTMENT PAGE ||============================== //

const Department = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        //in this useffect hook we check if the active user is allowed to view this page
        const path = location.pathname;
        const isAllowedPath = CheckPathPermission(path);
        if (!isAllowedPath) {
            navigate('/');
        }
        return () => {};
    }, []);

    const ImageApi = Connections.thumbnails;

    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [rowCountState] = useState(lastPage);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
        page: 1
    });

    const handleDatFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchDepartments();
        } else {
            FetchDepartments();
        }
    };

    const FetchDepartments = async () => {
        setLoading(true);

        var Api = Connections.api + Connections.departments + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
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
            setDepartments(data);
            setLastPage(parsed.data.last_page);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const { error } = useQuery(['data', paginationModel], () => handleDatFetching(), {
        refetchOnWindowFocus: false
    });

    const handleSearching = () => {
        setSearching(true);
        var Api =
            Connections.api +
            Connections.searchdepartment +
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
                    setDepartments(response.data.data);
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
            <MediumHeader
                title="Departments"
                back={true}
                option={false}
                sx={{ background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})` }}
            />

            <Grid container sx={{ minHeight: 200, padding: 1 }}>
                <SearchFilterAdd
                    searchText={search}
                    searching={searching}
                    onTextChange={(event) => setSearch(event.target.value)}
                    onSubmit={() => handleSearching()}
                    addTitle="Add Department"
                    onAdd={() => navigate('/department/add')}
                />

                <Grid container>
                    {loading ? (
                        <Grid
                            container
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 8
                            }}
                        >
                            <CircularProgress size={22} />
                        </Grid>
                    ) : departments.length === 0 ? (
                        <NoResult title="" message="Oooops... No department found!" />
                    ) : error ? (
                        <ErrorPrompt image={noresult} title="Server Error" message="Oooops... unable to retrive the departments!" />
                    ) : (
                        <Grid container>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} spacing={1}>
                                {departments.map((department, index) => (
                                    <DepartmentCard
                                        key={index}
                                        isLoading={loading}
                                        image={ImageApi + department.thumbnail}
                                        title={department.name}
                                        email={department.email}
                                        phone={department.phone}
                                        onPress={() => navigate('/department/view', { state: department })}
                                    />
                                ))}
                            </Grid>
                            <Box sx={{ paddingY: 4 }}>
                                <Pagination
                                    showFirstButton
                                    showLastButton
                                    count={rowCountState}
                                    page={paginationModel.page}
                                    onChange={handleChange}
                                />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Department;
