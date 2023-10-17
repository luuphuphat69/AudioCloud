import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import Notification from '../notify/notify_comp'; // Adjust the path to the actual location of your Notification component

const options = [
  { label: 'Like', icon: <FavoriteBorderIcon /> },
  { label: 'Add to playlist', icon: <PlaylistAddIcon /> },
  { label: 'Add to album', icon: <LibraryMusicIcon /> },
];

const ITEM_HEIGHT = 48;

export default function LongMenu({ audioId, handleLike }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLikeClick = () => {
    handleLike(audioId); // Call the handleLike function with audioId
    handleClose(); // Close the menu
    setShowNotification(true); // Show the notification
  };

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
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.label} onClick={option.label === 'Like' ? handleLikeClick : handleClose}>
            <ListItemIcon>{option.icon}</ListItemIcon>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
      {/* Render the Notification component */}
      {showNotification && (
        <Notification
          message="You liked this item!"
          type="success" // Set the type of notification (success, info, warning, error)
          onClose={() => setShowNotification(false)} // Close the notification
        />
      )}
    </div>
  );
}
