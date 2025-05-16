'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Box, 
  Drawer, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Collapse,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon,
  Dashboard,
  People,
  BarChart,
  Layers,
  Settings,
  Home,
  ExpandLess,
  ExpandMore,
  AdminPanelSettings,
  AccountCircle,
  Article,
  Lock,
  Person,
  Info,
  Work,
  ContactMail
} from '@mui/icons-material';
import Link from 'next/link';

interface AppDrawerProps {
  open: boolean;
  drawerWidth: number;
  onDrawerToggle: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create navigation items
interface NavItem {
  title: string;
  path?: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
  adminOnly?: boolean;
  children?: Omit<NavItem, 'children'>[];
}

const navItems: NavItem[] = [
  {
    title: 'Home',
    path: '/',
    icon: <Home />
  },
  // Add the new pages
  {
    title: 'About',
    path: '/about',
    icon: <Info />
  },
  {
    title: 'Team',
    path: '/team',
    icon: <People />
  },
  {
    title: 'Careers',
    path: '/careers',
    icon: <Work />
  },
  {
    title: 'Contact',
    path: '/contact',
    icon: <ContactMail />
  },
  // Existing items...
];

// const navItems: NavItem[] = [
//   {
//     title: 'Home',
//     path: '/',
//     icon: <Home />
//   },
//   {
//     title: 'Dashboard',
//     path: '/dashboard',
//     icon: <Dashboard />,
//     requiresAuth: true
//   },
//   {
//     title: 'Reports',
//     icon: <BarChart />,
//     requiresAuth: true,
//     children: [
//       {
//         title: 'Current Month',
//         path: '/reports/current',
//         icon: <Article />
//       },
//       {
//         title: 'Last Quarter',
//         path: '/reports/quarter',
//         icon: <Article />
//       },
//       {
//         title: 'Annual Report',
//         path: '/reports/annual',
//         icon: <Article />
//       }
//     ]
//   },
//   {
//     title: 'Users',
//     path: '/users',
//     icon: <People />,
//     requiresAuth: true,
//     adminOnly: true
//   },
//   {
//     title: 'Account',
//     icon: <AccountCircle />,
//     requiresAuth: true,
//     children: [
//       {
//         title: 'Profile',
//         path: '/Identity/Profile',
//         icon: <Person />
//       },
//       {
//         title: 'Settings',
//         path: '/Identity/Settings',
//         icon: <Settings />
//       }
//     ]
//   },
//   {
//     title: 'Admin',
//     icon: <AdminPanelSettings />,
//     requiresAuth: true,
//     adminOnly: true,
//     children: [
//       {
//         title: 'User Management',
//         path: '/admin/users',
//         icon: <People />
//       },
//       {
//         title: 'System Settings',
//         path: '/admin/settings',
//         icon: <Settings />
//       }
//     ]
//   }
// ];

export default function AppDrawer({
  open,
  drawerWidth,
  onDrawerToggle,
  isAuthenticated,
  isLoading
}: AppDrawerProps) {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  // Initialize open submenus based on current path
  useEffect(() => {
    const initialOpenSubMenus: { [key: string]: boolean } = {};
    
    // If a submenu item is active, open its parent
    navItems.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(child => child.path === pathname);
        if (isChildActive) {
          initialOpenSubMenus[item.title] = true;
        }
      }
    });
    
    setOpenSubMenus(initialOpenSubMenus);
  }, [pathname]);

  const handleSubMenuToggle = (title: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Filter items based on authentication status
  const filteredNavItems = navItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false;
    // For demo purposes - check if user has admin role
    if (item.adminOnly && !isAuthenticated) return false; 
    return true;
  });

  const drawerContent = (
    <>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end',
        px: [1]
      }}>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Menu
        </Typography>
        <IconButton onClick={onDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {filteredNavItems.map((item) => (
          <Box key={item.title}>
            {item.children ? (
              // Menu with submenu
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleSubMenuToggle(item.title)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                    {openSubMenus[item.title] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={openSubMenus[item.title]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem key={child.title} disablePadding>
                        <ListItemButton 
                          component={Link} 
                          href={child.path || '#'}
                          sx={{ pl: 4 }}
                          selected={pathname === child.path}
                        >
                          <ListItemIcon>{child.icon}</ListItemIcon>
                          <ListItemText primary={child.title} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              // Simple menu item
              <ListItem disablePadding>
                <ListItemButton 
                  component={Link} 
                  href={item.path || '#'}
                  selected={pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            )}
          </Box>
        ))}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onDrawerToggle}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}