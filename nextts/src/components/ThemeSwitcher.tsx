'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeSwitcher() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { theme, setTheme } = useTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Handle menu opening
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu closing
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  // Handle theme selection
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    handleClose();
  };
  
  // Get the current display theme icon
  const getThemeIcon = () => {
    if (theme === 'system') {
      return <SettingsBrightnessIcon />;
    } else if (theme === 'dark') {
      return <DarkModeIcon />;
    } else {
      return <LightModeIcon />;
    }
  };
  
  // Get the current theme label for accessibility
  const getThemeLabel = () => {
    if (theme === 'system') {
      return prefersDarkMode ? 'System (Dark)' : 'System (Light)';
    } else if (theme === 'dark') {
      return 'Dark';
    } else {
      return 'Light';
    }
  };
  
  return (
    <div>
      <Tooltip title="Change theme">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 1 }}
          aria-controls={Boolean(anchorEl) ? 'theme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
          aria-label={`Current theme: ${getThemeLabel()}`}
        >
          {getThemeIcon()}
          <ArrowDropDownIcon fontSize="small" />
        </IconButton>
      </Tooltip>
        <Menu
            id="theme-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
            }}
            transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
            }}
        >
            <MenuItem 
            onClick={() => handleThemeChange('light')}
            selected={theme === 'light'}
            >
            <ListItemIcon>
                <LightModeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Light</ListItemText>
            </MenuItem>
            <MenuItem 
            onClick={() => handleThemeChange('dark')}
            selected={theme === 'dark'}
            >
            <ListItemIcon>
                <DarkModeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Dark</ListItemText>
            </MenuItem>
            <MenuItem 
            onClick={() => handleThemeChange('system')}
            selected={theme === 'system'}
            >
            <ListItemIcon>
                <SettingsBrightnessIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>System</ListItemText>
            </MenuItem>
        </Menu>
    </div>
  );
}