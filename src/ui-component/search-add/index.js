import { Grid, Box, Paper, InputBase, Divider, IconButton, Button, Typography, CircularProgress, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Add } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export const SearchFilterAdd = ({ searchText, searching, onTextChange, onSubmit, addTitle, onAdd, children }) => {
    const { t } = useTranslation();
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingY: 2,
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
                <Box>
                    <Button variant="contained" color="primary" padding={3} onClick={onAdd}>
                        <Add size={10} />
                        <Typography marginLeft={1} variant="subtitle1" sx={{ color: theme.palette.background.default }}>
                            {t(addTitle)}
                        </Typography>
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
    addTitle: PropTypes.string,
    onAdd: PropTypes.func,
    children: PropTypes.node
};
