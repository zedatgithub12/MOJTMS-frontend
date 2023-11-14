import { Grid, Box, Paper, InputBase, Divider, IconButton, CircularProgress, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Add } from '@mui/icons-material';
import PropTypes from 'prop-types';

//============================= SEARCH MODULE COMPONENT ===========================//

export const SearchAdd = ({ searchText, searching, onTextChange, onSubmit, onAdd, children }) => {
    const theme = useTheme();
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit();
        }
    };
    return (
        <Grid container>
            <Grid
                item
                xs={12}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingY: 1
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Paper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: 400,
                            backgroundColor: theme.palette.secondary.light
                        }}
                    >
                        <InputBase
                            sx={{ px: 1.5, flex: 1 }}
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchText}
                            onChange={onTextChange}
                            onKeyDown={handleKeyPress}
                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <IconButton type="button" sx={{ p: '8px' }} aria-label="search" onClick={onSubmit}>
                            {searching ? <CircularProgress size={20} /> : <SearchIcon />}
                        </IconButton>
                    </Paper>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        {children}
                    </Box>
                </Box>
                <Box sx={{ marginLeft: 2 }}>
                    <IconButton
                        color="secondary"
                        sx={{ background: `linear-gradient(to right, ${theme.palette.primary[200]}, ${theme.palette.secondary.light})` }}
                        onClick={onAdd}
                        title="Create module"
                    >
                        <Add size={12} />
                    </IconButton>
                </Box>
            </Grid>
        </Grid>
    );
};

SearchAdd.propTypes = {
    searchText: PropTypes.string,
    onTextChange: PropTypes.func,
    onSubmit: PropTypes.func,
    searching: PropTypes.bool,
    onAdd: PropTypes.func,
    children: PropTypes.node
};
