import { Grid, Box, Paper, InputBase, Divider, IconButton, Button, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Add } from '@mui/icons-material';
import PropTypes from 'prop-types';

export const SearchFilterAdd = ({ searchText, onTextChange, onSubmit, role, roles, onRoleChange, onAddUser }) => {
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
                    paddingY: 2
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
                            placeholder="Search users"
                            inputProps={{ 'aria-label': 'search users' }}
                            value={searchText}
                            onChange={onTextChange}
                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <IconButton type="button" sx={{ p: '8px' }} aria-label="search" onClick={onSubmit}>
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <FormControl sx={{ ml: 2, minWidth: 100 }} size="small">
                            <Select id="role-select-autowidth" value={role} onChange={onRoleChange} autoWidth sx={{ padding: 0.5 }}>
                                <MenuItem value="Role">Role</MenuItem>
                                <Divider />
                                <MenuItem value={10}>Admin</MenuItem>
                                <MenuItem value={21}>Coordinator</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box>
                    <Button variant="text" color="primary" padding={2} onClick={onAddUser}>
                        <Add size={10} />{' '}
                        <Typography marginLeft={1} variant="subtitle1">
                            New user
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
    role: PropTypes.string,
    roles: PropTypes.object,
    onRoleChange: PropTypes.func,
    onAddUser: PropTypes.func
};
