import { useState } from 'react';
// material-ui
import { Grid, Box, Typography, useTheme } from '@mui/material';
// project imports
import Connections from 'api';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { PageHeader } from 'ui-component/page-header/PageHeader';
import { SearchFilterAdd } from 'ui-component/search-add';
import DepartmentCard from 'ui-component/cards/DepartmentCard';

// ==============================|| DEPARTMENT PAGE ||============================== //

const Department = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const ImageApi = Connections.thumbnails;

    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [rowCountState] = useState(lastPage);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 15,
        page: 0,
        pageCount: 0,
        pageStartIndex: 0,
        pageEndIndex: 0
    });

    const FetchDepartments = async () => {
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
            setLastPage(parsed.data.last_page);
            const data = parsed.data.data;
            setDepartments(data);
        }
    };

    const { isLoading, error } = useQuery(['data', paginationModel], () => FetchDepartments(), {
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
            <PageHeader title="Departments" back={true} sx={{ backgroundColor: theme.palette.secondary.dark }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant="h3" color={'white'}>
                        Departments
                    </Typography>
                </Box>
            </PageHeader>

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
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} spacing={1}>
                        {departments.map((department) => (
                            <DepartmentCard
                                isLoading={isLoading}
                                image={ImageApi + department.thumbnail}
                                title={department.name}
                                email={department.email}
                                phone={department.phone}
                                onPress={() => navigate('/department/view', { state: department })}
                            />
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Department;
