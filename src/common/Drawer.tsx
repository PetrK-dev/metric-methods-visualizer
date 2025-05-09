// src/common/Drawer.tsx
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Divider, IconButton, Collapse, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

/**
 * Navigation drawer component for application menu.
 * Provides access to all sections of the application including:
 * - Home page
 * - Theoretical foundations of metric methods
 * - Implementations of individual metric methods (AESA, LAESA, M-Tree)
 * - Application information
 * 
 * @returns {React.ReactElement} Navigation drawer component
 */
export default function TemporaryDrawer() {
  /** State for opening/closing the entire drawer panel */
  const [open, setOpen] = useState<boolean>(false);
  
  /** State for expanding/collapsing the theory section */
  const [theoryOpen, setTheoryOpen] = useState<boolean>(true);
  
  /** Hook for navigation between pages */
  const navigate = useNavigate();

  /**
   * Toggles the drawer open/closed state
   * 
   * @param {boolean} newOpen - New drawer state (true = open, false = closed)
   * @returns {void}
   */
  const toggleDrawer = (newOpen: boolean): void => {
    setOpen(newOpen);
  };

  /**
   * Redirects to the specified path and closes the drawer panel
   * 
   * @param {string} path - Navigation path 
   * @returns {void}
   */
  const handleNavigation = (path: string): void => {
    navigate(path);
    toggleDrawer(false);
  };

  /**
   * Toggles the expanded/collapsed state of the theory section
   * 
   * @returns {void}
   */
  const handleTheoryClick = (): void => {
    setTheoryOpen(!theoryOpen);
  };

  /**
   * Drawer content with navigation items
   */
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      {/* Hlavní navigace - domovská stránka */}
      <List>  
        <ListItem onClick={() => handleNavigation('/')} disablePadding>
            <ListItemButton>
                <HomeIcon sx={{ mr: 2 }} />
                <ListItemText primary="Home" />
            </ListItemButton>
        </ListItem>
      </List>
      
      <Divider />
      
      {/* Teoretická sekce s rozbalovací nabídkou */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleTheoryClick}>
            <SchoolIcon sx={{ mr: 2 }} />
            <ListItemText primary="Teorie" />
            {theoryOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={theoryOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/theory')}>
              <ListItemText primary="Přehled teorie" />
            </ListItemButton>
            
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/theory/basics')}>
              <ListItemText primary="Základy metrických metod" />
            </ListItemButton>
            
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/theory/metric-space')}>
              <ListItemText primary="Metrický prostor" />
            </ListItemButton>
            
            <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/theory/key-principles')}>
              <ListItemText primary="Klíčové principy" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      
      <Divider />
      
      {/* Metrické metody - implementace */}
      <List>
        <ListItem>
          <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 2 }}>
            METRICKÉ METODY
          </Typography>
        </ListItem>
        
        <ListItem onClick={() => handleNavigation('/aesa')} disablePadding>
            <ListItemButton>
                <ListItemText primary="AESA" />
            </ListItemButton>
        </ListItem>
        
        <ListItem onClick={() => handleNavigation('/laesa')} disablePadding>
            <ListItemButton>
                <ListItemText primary="LAESA" />
            </ListItemButton>
        </ListItem>
        
        <ListItem onClick={() => handleNavigation('/mtree')} disablePadding>
            <ListItemButton>
                <ListItemText primary="M-Tree" />
            </ListItemButton>
        </ListItem>
      </List>
      
      <Divider />
      
      {/* O aplikaci - informace a dokumentace */}
      <List>
        <ListItem onClick={() => handleNavigation('/about')} disablePadding>
            <ListItemButton>
                <InfoIcon sx={{ mr: 2 }} />
                <ListItemText primary="O aplikaci" />
            </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {/* Ikona pro otevření drawer panelu */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      
      {/* Drawer komponenta */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}