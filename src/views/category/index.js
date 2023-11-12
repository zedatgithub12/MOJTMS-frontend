import { useState } from 'react';
// material-ui
import { Grid, Box, useTheme, Pagination, CircularProgress, IconButton, Typography } from '@mui/material';
// project imports
import Connections from 'api';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { SearchFilterAdd } from 'ui-component/search-add';
import { RefreshToken } from 'utils/token-refresh';
import { MiniHeader } from 'ui-component/page-header/miniHeader';
import noresult from 'assets/images/no_result.png';
import errorImage from 'assets/images/error.jpg';
import { NoResult } from 'utils/components/noresult';
import { ErrorPrompt } from 'utils/components/errorprompt';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import AddCategory from './components/add';
import { IconChevronDown, IconChevronRight, IconEdit, IconEditCircle, IconTrash } from '@tabler/icons';
import { IconLabel } from 'ui-component/content/IconLabel';
import { Delete } from 'ui-component/delete/Delete';
import UpdateCategory from './components/update';

// ==============================|| CATEGORY PAGE ||============================== //

const Category = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expand, setExpand] = useState(false);
    const [lastPage, setLastPage] = useState(1);
    const [rowCountState] = useState(lastPage);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 20,
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
            setLastPage(parsed.data.last_page);
            const data = parsed.data.data;
            setCategories(data);
            setLoading(false);
        }
    };

    const { isLoading, error } = useQuery(['data', paginationModel], () => handleCategoryFetching(), {
        refetchOnWindowFocus: false
    });

    const handleChange = (event, value) => {
        setPaginationModel({
            ...paginationModel,
            page: value
        });
    };

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
            <MiniHeader title="Categories" back={true} sx={{ backgroundColor: theme.palette.secondary.dark }} />

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
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }} spacing={1}>
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
                                buttontitle="Go Back"
                                onPress={() => navigate(-1)}
                            />
                        ) : categories.length == 0 ? (
                            <NoResult
                                image={noresult}
                                title="Result Not Found"
                                message="Oooops... No category found in the moment!"
                                buttontitle="Go Back"
                                onPress={() => navigate(-1)}
                            />
                        ) : (
                            categories.map((category) => (
                                <Box key={category.id}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginY: 0.5,
                                            paddingX: 1.2,
                                            borderRadius: 2,
                                            backgroundColor:
                                                selectedCategory && selectedCategory.id == category.id && theme.palette.primary[200],
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

                                        <Box SX={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <IconButton onClick={() => handleUpdateInit(category)}>
                                                <IconEdit size={18} />
                                            </IconButton>
                                            <IconButton onClick={() => initiateDeleteCategory(category)}>
                                                <IconTrash size={18} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    {expand && selectedCategory && selectedCategory.id == category.id && (
                                        <Box sx={{ paddingLeft: 7, paddingY: 0.5 }}>
                                            <Typography variant="body2">{category.description}</Typography>
                                        </Box>
                                    )}
                                </Box>
                            ))
                        )}
                    </Grid>
                </Grid>
            </Grid>
            <AddCategory open={open} handleDialogClose={() => setOpen(false)} />
            {selectedCategory && <UpdateCategory open={update} handleDialogClose={() => setUpdate(false)} selectedCat={selectedCategory} />}
            {deleteCategory && (
                <Delete
                    open={deleteCategory}
                    title="Deleting Category"
                    description={`Are you sure, do you want to delete ` + selectedCategory.name}
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
