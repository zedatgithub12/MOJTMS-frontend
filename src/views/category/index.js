import { useState } from 'react';
// material-ui
import { Grid, Box, useTheme, Pagination, CircularProgress, IconButton, Typography } from '@mui/material';
// project imports
import { useQuery } from 'react-query';
import { SearchFilterAdd } from 'ui-component/search-add';
import { RefreshToken } from 'utils/token-refresh';
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { IconChevronDown, IconChevronRight, IconEdit, IconTrash } from '@tabler/icons';
import { IconLabel } from 'ui-component/content/IconLabel';
import { Delete } from 'ui-component/delete/Delete';
import { useTranslation } from 'react-i18next';
import UpdateCategory from './components/update';
import Connections from 'api';
import errorImage from 'assets/images/error.jpg';
import AddCategory from './components/add';

// ==============================|| CATEGORY PAGE ||============================== //

const Category = () => {
    const { t } = useTranslation();
    const theme = useTheme();

    const userstring = sessionStorage.getItem('user');
    const user = JSON.parse(userstring);
    const role = user.user.role;

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expand, setExpand] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 1
    });
    const [update, setUpdate] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDialogOpen = () => {
        setOpen(true);
    };

    const handleCategoryFetching = async () => {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const currentTime = new Date().getTime();

        if (tokenExpiration && currentTime >= tokenExpiration) {
            await RefreshToken();
            FetchCategory();
        } else {
            FetchCategory();
        }
    };

    const FetchCategory = async () => {
        setLoading(true);
        var Api = Connections.api + Connections.categories + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}`;
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
            setPageCount(parsed.data.last_page);
            setCategories(data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const { error } = useQuery(['data', paginationModel], () => handleCategoryFetching(), {
        refetchOnWindowFocus: false
    });

    const handlePrompts = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const handleExpnadCollapse = (cat) => {
        if (expand && selectedCategory && selectedCategory.id == cat.id) {
            setExpand(false);
            setSelectedCategory(null);
        } else {
            setSelectedCategory(cat);
            setExpand(true);
        }
    };

    const handleUpdateInit = (cat) => {
        setUpdate(true);
        setSelectedCategory(cat);
    };

    const initiateDeleteCategory = (cat) => {
        setDeleteCategory(true);
        setSelectedCategory(cat);
    };

    const handleSearching = () => {
        setSearching(true);
        var Api =
            Connections.api + Connections.categorsearch + `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&query=${search}`;
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
                    setCategories(response.data.data);
                } else {
                    setSearching(false);
                }
            })
            .catch((error) => {
                setSearching(false);
                handlePrompts(error, 'error');
            });
    };

    const handleDeleteCategories = () => {
        setDeleting(true);

        var Api = Connections.api + Connections.categories + '/' + selectedCategory.id;
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
                    setDeleteCategory(false);
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

    const handleChange = (event, value) => {
        setPaginationModel({
            ...paginationModel,
            page: value
        });
    };

    return (
        <Grid container alignItems={'center'} justifyContent={'center'}>
            <Grid
                item
                xs={12}
                sm={12}
                md={8}
                lg={6}
                xl={6}
                sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    background: theme.palette.primary.light,
                    borderColor: theme.palette.primary[200]
                }}
            >
                <MiniHeader
                    title="Categories"
                    back={true}
                    sx={{ background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})` }}
                />

                <Grid container sx={{ minHeight: 200, padding: 1 }}>
                    <SearchFilterAdd
                        searchText={search}
                        searching={searching}
                        onTextChange={(event) => setSearch(event.target.value)}
                        onSubmit={() => handleSearching()}
                        addTitle="Add Category"
                        onAdd={() => handleDialogOpen()}
                    />

                    <Grid container>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', paddingX: 2 }}>
                            {loading ? (
                                <Grid container>
                                    <Grid
                                        item
                                        xs={12}
                                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <CircularProgress size={20} />
                                    </Grid>
                                </Grid>
                            ) : error ? (
                                <ErrorPrompt
                                    image={errorImage}
                                    title="Server Error"
                                    message="Oooops... There is server error fetching category!"
                                />
                            ) : categories.length == 0 ? (
                                <NoResult title="" message="Oooops... No category found" />
                            ) : (
                                <div>
                                    {categories.map((category) => (
                                        <Box
                                            key={category.id}
                                            sx={{
                                                marginY: 1,
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: theme.palette.primary[200]
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingX: 1.2,
                                                    borderRadius: 2,
                                                    backgroundColor:
                                                        selectedCategory &&
                                                        selectedCategory.id == category.id &&
                                                        theme.palette.primary[200],
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <IconLabel content={category.name} sx={{ paddinY: 3 }}>
                                                    <IconButton onClick={() => handleExpnadCollapse(category)}>
                                                        {expand && selectedCategory.id == category.id ? (
                                                            <IconChevronDown size={16} />
                                                        ) : (
                                                            <IconChevronRight size={16} />
                                                        )}
                                                    </IconButton>
                                                </IconLabel>

                                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <IconButton onClick={() => handleUpdateInit(category)}>
                                                        <IconEdit size={16} />
                                                    </IconButton>
                                                    {role === 'Admin' && (
                                                        <IconButton onClick={() => initiateDeleteCategory(category)}>
                                                            <IconTrash size={16} style={{ color: theme.palette.error.main }} />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </Box>
                                            {expand && selectedCategory && selectedCategory.id == category.id && (
                                                <Box sx={{ paddingLeft: 7, paddingY: 0.5 }}>
                                                    <Typography variant="body2">{t(category.description)}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    ))}

                                    <Box sx={{ paddingY: 4 }}>
                                        <Pagination count={pageCount} page={paginationModel.page} onChange={handleChange} />
                                    </Box>
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <AddCategory open={open} handleDialogClose={() => setOpen(false)} onRefresh={() => FetchCategory()} />
            {selectedCategory && (
                <UpdateCategory
                    open={update}
                    handleDialogClose={() => setUpdate(false)}
                    selectedCat={selectedCategory}
                    onRefresh={() => FetchCategory()}
                />
            )}
            {deleteCategory && (
                <Delete
                    open={deleteCategory}
                    title="Deleting Category"
                    description={t('Are you sure, do you want to delete ') + selectedCategory.name}
                    onNo={() => setDeleteCategory(false)}
                    onYes={() => handleDeleteCategories()}
                    deleting={deleting}
                    handleClose={() => setDeleteCategory(false)}
                />
            )}
            <SnackbarProvider maxSnack={3} />
        </Grid>
    );
};

export default Category;
