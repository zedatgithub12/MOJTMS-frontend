// material-ui
import { Grid, Box, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageHeader } from 'ui-component/page-header/PageHeader';
import { SearchFilterAdd } from 'ui-component/search-add';

// project imports

// ==============================|| DEPARTMENT PAGE ||============================== //

const Department = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const handleSearching = () => {
        alert('searching');
    };

    const handleDialogOpen = () => {
        setOpenAddDialog(true);
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

                <Typography variant="body2">Department childrens</Typography>
            </Grid>
        </Grid>
    );
};

export default Department;
