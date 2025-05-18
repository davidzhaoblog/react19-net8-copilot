'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    Button,
    Chip,
    Grid,
    CircularProgress,
    Alert
} from '@mui/material';
import { Person, Email, Badge, VerifiedUser, ManageAccounts, Security } from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import authService from '@/services/authService';

interface UserProfile {
    id: string;
    userName: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
    emailConfirmed?: boolean;
}

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading: authLoading, getUserProfile } = useAuth();
    //const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (isAuthenticated) {
                setIsLoading(true);
                try {
                    await getUserProfile();
                } catch (err) {
                    console.error('Error fetching profile:', err);
                    setError('An unexpected error occurred while loading your profile');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchProfile();
    }, [isAuthenticated]);

    if (authLoading || isLoading) {
        return (
            <Box className="flex justify-center items-center min-h-screen">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="container mx-auto p-4">
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return (
            <Box className="container mx-auto p-4">
                <Paper className="p-6">
                    <Typography variant="h5" className="mb-4">
                        Authentication Required
                    </Typography>
                    <Typography variant="body1" className="mb-4">
                        Please log in to view your profile
                    </Typography>
                    <Link href="/Identity/Login?returnUrl=/Identity/Profile" passHref>
                        <Button variant="contained" color="primary">
                            Sign In
                        </Button>
                    </Link>
                </Paper>
            </Box>
        );
    }

    return (
        <Box className="container mx-auto p-4">
            <Box className="mb-6">
                <Typography variant="h4" component="h1" className="mb-1">
                    User Profile
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Manage your account information and settings
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid size={12} >
                    <Paper elevation={2} className="p-6">
                        <Box className="flex flex-col items-center text-center mb-4">
                            <Avatar
                                sx={{ width: 128, height: 128, fontSize: 64, mb: 2 }}
                                className="bg-blue-600"
                            >
                                {user?.userName?.[0] || 'U'}
                            </Avatar>
                            {/* <Typography variant="h5" className="font-medium">
                                {profile?.firstName} {profile?.lastName}
                            </Typography> */}
                            <Typography variant="body1" color="textSecondary">
                                @{user?.userName}
                            </Typography>

                            <Box className="mt-3">
                                {user?.roles?.map(role => (
                                    <Chip
                                        key={role}
                                        label={role}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        className="m-1"
                                    />
                                ))}
                            </Box>
                        </Box>

                        <Divider className="my-4" />

                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Email Verification"
                                    secondary={user?.emailConfirmed ? "Verified" : "Not verified"}
                                />
                                {!user?.emailConfirmed && (
                                    <Link href="/Identity/ResendEmailConfirmation" passHref>
                                        <Button size="small" variant="outlined">
                                            Verify
                                        </Button>
                                    </Link>
                                )}
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Account Created"
                                    secondary="May 15, 2025"
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                <Grid size={12}>
                    <Paper elevation={2} className="p-6 mb-4">
                        <Typography variant="h6" className="flex items-center mb-4">
                            <Person className="mr-2" /> Personal Information
                        </Typography>

                        <List>
                            {/* {profile?.firstName && profile?.lastName && (
                                <ListItem divider>
                                    <ListItemText
                                        primary="Full Name"
                                        secondary={`${profile.firstName} ${profile.lastName}`}
                                    />
                                </ListItem>
                            )} */}
                            <ListItem divider>
                                <ListItemText
                                    primary="Username"
                                    secondary={user?.userName}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Email Address"
                                    secondary={user?.email}
                                />
                                {user?.emailConfirmed ? (
                                    <Chip
                                        icon={<VerifiedUser fontSize="small" />}
                                        label="Verified"
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                    />
                                ) : (
                                    <Chip
                                        label="Not Verified"
                                        size="small"
                                        color="warning"
                                        variant="outlined"
                                    />
                                )}
                            </ListItem>
                        </List>
                    </Paper>

                    <Paper elevation={2} className="p-6">
                        <Typography variant="h6" className="flex items-center mb-4">
                            <ManageAccounts className="mr-2" /> Account Management
                        </Typography>

                        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/Identity/ChangePassword" passHref>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    startIcon={<Security />}
                                >
                                    Change Password
                                </Button>
                            </Link>

                            <Link href="/Identity/PersonalData" passHref>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Badge />}
                                >
                                    Personal Data
                                </Button>
                            </Link>

                            <Link href="/Identity/TwoFactorAuthentication" passHref>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<VerifiedUser />}
                                >
                                    Two-Factor Authentication
                                </Button>
                            </Link>

                            <Link href="/Identity/ExternalLogins" passHref>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<Email />}
                                >
                                    External Logins
                                </Button>
                            </Link>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}