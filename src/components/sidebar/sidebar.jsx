// import React from 'react';
import PropTypes from 'prop-types';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Dataset, Assessment, LineStyle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <div className="sidebar">
        <div className="sidebarWrapper">
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Admin</h3>
            <List className="sidebarList">
              <Link to="/reports" className="link">
                <ListItem button className="sidebarListItem" onClick={onClose}>
                  <ListItemIcon><Dataset className="sidebarIcon" /></ListItemIcon>
                  <ListItemText primary="Reports" />
                </ListItem>
              </Link>
              <Link to="/dashboard" className="link">
                <ListItem button className="sidebarListItem" onClick={onClose}>
                  <ListItemIcon><LineStyle className="sidebarIcon" /></ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </Link>
              <ListItem button className="sidebarListItem">
                <ListItemIcon><Assessment className="sidebarIcon" /></ListItemIcon>
                <ListItemText primary="Analytics" />
              </ListItem>
            </List>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  
export default Sidebar;
