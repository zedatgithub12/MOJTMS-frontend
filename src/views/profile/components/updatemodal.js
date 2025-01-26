import React, { useState } from 'react';
import { Modal, Grid, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, useTheme, Typography } from '@mui/material';

const UserAccountModal = ({ open, onClose }) => {
    const theme = useTheme();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Phone:', phone);
        console.log('Role:', role);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={5}
                    xl={5}
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: 4,
                        paddingTop: 2,
                        borderRadius: 3
                    }}
                >
                    <Typography variant="h3" sx={{ marginY: 2, marginBottom: 4 }}>
                        Edit Account
                    </Typography>
                    <form
                        onSubmit={handleFormSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <TextField
                            label="Name"
                            variant="outlined"
                            value={name}
                            onChange={handleNameChange}
                            style={{ marginBottom: '16px', width: '100%' }}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={handleEmailChange}
                            style={{ marginBottom: '16px', width: '100%' }}
                        />
                        <TextField
                            label="Phone"
                            variant="outlined"
                            value={phone}
                            onChange={handlePhoneChange}
                            style={{ marginBottom: '16px', width: '100%' }}
                        />
                        <FormControl variant="outlined" style={{ marginBottom: '16px', width: '100%' }}>
                            <InputLabel>Role</InputLabel>
                            <Select value={role} onChange={handleRoleChange} label="Role">
                                <MenuItem value="">Select Role</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 2 }}>
                            <Button type="submit" variant="text" color="dark" sx={{ marginRight: 3 }}>
                                cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Save Changes
                            </Button>
                        </Box>
                    </form>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default UserAccountModal;
