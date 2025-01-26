import { Grid, Box, Paper, InputBase, Divider, IconButton, Button, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';

export const SearchFilterAdd = ({ searchText, searching, onTextChange, onSubmit, onAddUser }) => {
    const { t } = useTranslation();
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingY: 4,
                    paddingX: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Paper component="form" sx={{ p: '3px 4px', boxShadow: 1, display: 'flex', alignItems: 'center', width: 400 }}>
                        <InputBase
                            sx={{ ml: 1, px: 1.5, flex: 1 }}
                            placeholder={t('Search')}
                            inputProps={{ 'aria-label': 'search users' }}
                            value={searchText}
                            onChange={onTextChange}
                            onKeyDown={handleKeyPress}
                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <IconButton type="button" sx={{ p: '8px' }} aria-label="search" onClick={onSubmit}>
                            {searching ? <CircularProgress size={20} /> : <SearchIcon />}
                        </IconButton>
                    </Paper>
                </Box>
                <Box>
                    <Button variant="contained" color="primary" padding={2} onClick={onAddUser}>
                        <Add size={6} sx={{ marginRight: 1 }} /> {t('New user')}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

SearchFilterAdd.propTypes = {
    searchText: PropTypes.string,
    onTextChange: PropTypes.func,
    onSubmit: PropTypes.func,
    searching: PropTypes.bool,
    onAddUser: PropTypes.func
};
