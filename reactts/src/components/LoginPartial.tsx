import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography, Stack } from '@mui/material';
import { whenUserLogout } from '@/store/slices/userSlice';
import { useNavigate } from 'react-router-dom';

import { RootState } from '@/store/Store'; // Adjust the import path based on your store setup

const LoginPartial: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, userName } = useSelector((state: RootState) => state.user);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        dispatch(whenUserLogout());
    };

    return (
        <Stack direction="row" spacing={2} alignItems="center">
            {isAuthenticated ? (
                <>
                    <Typography variant="body1">Welcome, {userName}!</Typography>
                    <Button variant="outlined" color="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                </>
            ) : (
                <Button variant="contained" color="primary" onClick={handleLogin}>
                    Login
                </Button>
            )}
        </Stack>
    );
};

export default LoginPartial;