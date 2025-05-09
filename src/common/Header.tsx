import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TemporaryDrawer from './Drawer';

/**
 * Props interface for the Header component
 */
interface HeaderProps {
  /** Page title displayed in the header */
  pageTitle: string;
}

/**
 * Application header component.
 * Contains a navigation menu (drawer) and the current page title.
 * Used on all application pages for a consistent appearance.
 * 
 * @param {HeaderProps} props - Component properties
 * @param {string} props.pageTitle - Page title displayed in the header
 * @returns {React.ReactElement} Header component
 */
const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Komponenta pro vysunovací navigační menu */}
        <TemporaryDrawer />
        
        {/* Titulek stránky - vyplní zbývající prostor */}
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {pageTitle}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;