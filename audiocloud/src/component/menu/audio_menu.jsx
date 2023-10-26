import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Notification from '../notify/notify_comp';
import Popup_Playlist from '../popup/add_to_playlist';

const options = [
  { label: 'Thích', name:'Like', icon: <FavoriteBorderIcon /> },
  { label: 'Thêm vào playlist', name: 'Add to playlist', icon: <PlaylistAddIcon /> },
];

const ITEM_HEIGHT = 48;

export default function LongMenu({ audioId, handleLike}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePlaylistClick = () => {
    // Open popup
    setShowPopup(true);
    handleClose();
  };
  
  const closePopup = () => {
    // Close popup
    setShowPopup(false);
  }

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
        }}>
        {options.map((option) => (
          <MenuItem key={option.label} onClick={option.name === 'Like' ? handleLikeClick : option.name === 'Add to playlist' ? handlePlaylistClick : handleClose}>
            <ListItemIcon>{option.icon}</ListItemIcon>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
      {/* Render the Notification component */}
      {showNotification && (
        <Notification
          message="Đã thích bài hát !!"
          type="success" // Set the type of notification (success, info, warning, error)
          onClose={() => setShowNotification(false)} // Close the notification
        />
      )}
      {showPopup && <Popup_Playlist audioId={audioId} closePopup={closePopup} />}
    </div>
  );
}
