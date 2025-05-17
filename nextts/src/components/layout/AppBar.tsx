'use client';

import { useState } from 'react';
import {
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Button,
    Avatar,
    Tooltip,
    Badge
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    AccountCircle,

} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ThemeSwitcher from '../ThemeSwitcher';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslations } from 'next-intl';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
    drawerWidth: number;
    onDrawerToggle?: () => void;
}

const StyledAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth',
})<AppBarProps>(({ theme, open, drawerWidth }) => ({
    // Use correct background based on theme mode
    backgroundColor: theme.palette.mode === 'dark' 
        ? theme.palette.background.default
        : theme.palette.background.paper, // or '#ffffff' for white
    color: theme.palette.text.primary, // This ensures proper text color in both modes
   
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export default function AppBar({ open, drawerWidth, onDrawerToggle }: AppBarProps) {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const t = useTranslations('app');
    const { user, isAuthenticated, logout } = useAuth();

    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        router.push('/');
    };

    const handleProfile = () => {
        handleClose();
        router.push('/Identity/Profile');
    };

    const getInitials = () => {
        if (!user?.username) return user?.email?.[0]?.toUpperCase() || '?';
        return user.username.charAt(0).toUpperCase();
    };

    return (
        <StyledAppBar position="fixed" open={open} drawerWidth={drawerWidth} className="bg-gray-800 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300" >
            <Toolbar className="bg-transparent">
                { isAuthenticated && <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={onDrawerToggle}
                    edge="start"
                    sx={{ mr: 2, ...(open ? { display: 'none' } : {}) }}
                >
                    <MenuIcon />
                </IconButton>}


                <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    href="/"
                    sx={{
                        color: 'inherit',
                        textDecoration: 'none',
                        flexGrow: 1
                    }}
                >
                    {t('appName')}
                </Typography>

                <LanguageSwitcher />
                <ThemeSwitcher />
                {isAuthenticated ? (
                    <>
                        {/* Notifications */}
                        <IconButton
                            color="inherit"
                            onClick={handleNotificationMenu}
                            sx={{ ml: 1 }}
                        >
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Menu
                            anchorEl={notificationAnchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(notificationAnchorEl)}
                            onClose={handleNotificationClose}
                        >
                            <MenuItem onClick={handleNotificationClose}>New message from John</MenuItem>
                            <MenuItem onClick={handleNotificationClose}>Your task was completed</MenuItem>
                            <MenuItem onClick={handleNotificationClose}>New update available</MenuItem>
                            <MenuItem onClick={handleNotificationClose}>
                                <Typography variant="body2" color="primary">See all notifications</Typography>
                            </MenuItem>
                        </Menu>

                        {/* User menu */}
                        <Box sx={{ ml: 2 }}>
                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleMenu}
                                    size="small"
                                    sx={{ p: 0 }}
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                >
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                        {getInitials()}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>My account</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    </>
                ) : (
                    <Box>
                        <Button color="inherit" component={Link} href="/Identity/Login">
                            Login
                        </Button>
                        <Button
                            variant="outlined"
                            color="inherit"
                            component={Link}
                            href="/Identity/Register"
                            sx={{ ml: 1 }}
                        >
                            Register
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </StyledAppBar>
    );
}