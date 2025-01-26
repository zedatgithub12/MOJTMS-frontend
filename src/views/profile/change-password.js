import React, { useState } from 'react';
import { TextField, Button, Container, useTheme } from '@mui/material';

const Changepassword = () => {
    const theme = useTheme();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleCurrentPasswordChange = (event) => {
        setCurrentPassword(event.target.value);
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Perform password change logic here
        // You can validate the passwords and make an API call to update the password

        // Reset form fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        alert('Password changed successfully!');
    };

    return (
        <Container maxWidth="sm" sx={{ backgroundColor: theme.palette.background.default, borderRadius: 3, padding: 2, paddingX: 4 }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" type="submit" color="primary" sx={{ marginTop: 2 }}>
                    Change Password
                </Button>
            </form>
        </Container>
    );
};

export default Changepassword;
