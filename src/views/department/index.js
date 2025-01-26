import { useEffect, useState } from 'react';
// material-ui
import { Grid, useTheme, CircularProgress, useMediaQuery, TablePagination } from '@mui/material';
// project imports
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router';
import { SearchFilterAdd } from 'ui-component/search-add';
import { RefreshToken } from 'utils/token-refresh';
import { MediumHeader } from 'ui-component/page-header/mediumHeader';
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import Connections from 'api';
import DepartmentCard from 'ui-component/cards/DepartmentCard';
import noresult from 'assets/images/no_result.png';
import CheckPathPermission from 'utils/path-checker';
import DepartmentHorizontalCard from 'ui-component/cards/DepartmentHorizontalCard';

// ==============================|| DEPARTMENT PAGE ||============================== //

const Department = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));

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
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
        page: 0,
        total: 0
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
            setPaginationModel((prevState) => ({ ...prevState, total: parsed.data.total }));
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const { error } = useQuery(
        ['data', paginationModel],
        () => handleDatFetching(),
        {
            refetchOnWindowFocus: false
        },
        [paginationModel.page]
    );

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

    const handleChangePage = (event, newPage) => {
        setPaginationModel({ ...paginationModel, page: newPage });
    };

    const handleChangeRowsPerPage = (event) => {
        setPaginationModel({ ...paginationModel, pageSize: event.target.value, page: 0 });
    };

    return (
        <Grid
            container
            sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: theme.palette.primary[200] + 25
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

                <Grid container spacing={2} mt={1} sx={{ display: 'flex', justifyContent: 'center' }}>
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
                        <>
                            {smallDevice ? (
                                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {departments.map((department, index) => (
                                        <DepartmentCard
                                            key={index}
                                            isLoading={loading}
                                            image={department.thumbnail ? ImageApi + department.thumbnail : null}
                                            title={department.name}
                                            email={department.email}
                                            phone={department.phone}
                                            onPress={() => navigate('/department/view', { state: department })}
                                        />
                                    ))}
                                </Grid>
                            ) : (
                                <Grid item xs={11.6}>
                                    {departments.map((department, index) => (
                                        <DepartmentHorizontalCard
                                            key={index}
                                            isLoading={loading}
                                            image={department.thumbnail ? ImageApi + department.thumbnail : null}
                                            title={department.name}
                                            email={department.email}
                                            phone={department.phone}
                                            onPress={() => navigate('/department/view', { state: department })}
                                        />
                                    ))}
                                </Grid>
                            )}
                            <Grid container sx={{ paddingY: 4, paddingX: 4 }}>
                                <Grid item xs={12}>
                                    {/* {!loading && paginationModel.total > paginationModel.pageSize && ( */}
                                    <TablePagination
                                        component="div"
                                        rowsPerPageOptions={[10, 25, 50, 100]}
                                        count={paginationModel.total}
                                        rowsPerPage={paginationModel.pageSize}
                                        page={paginationModel.page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage="List per page"
                                    />
                                    {/* )} */}
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Department;
