import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon'; // Import ListItemIcon
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit'; // Import icons
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Popup_Playlist from '../popup/add_to_playlist';

const options = [
  { label: 'Edit', icon: <EditIcon /> }, // Use icons for options
  { label: 'Delete', icon: <DeleteIcon /> },
  { label: 'Add to playlist', icon: <PlaylistAddIcon /> },
];

const ITEM_HEIGHT = 48;

export default function LongMenu({ audioId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddToPlaylist = () => {
    setShowPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  }
  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose} // Use handleMenuClose for menu closure
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              if (option.label === 'Add to playlist') {
                handleAddToPlaylist();
              } else {
                handleClose();
              }
            }}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            {option.label}
          </MenuItem>
        ))}
        {showPopup ? <Popup_Playlist audioId={audioId} closePopup={handleClosePopup} /> : null}
      </Menu>
    </div>
  );
}
