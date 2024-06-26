// import * as React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Box, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import "./topbar.css";

export default function Topbar({ onMenuClick }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="topbar">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="heading">
            Data
          </Typography>
          <Button color="inherit" className="loginbtn">Signin</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

Topbar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};
