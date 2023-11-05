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
import Notification from '../notify/notify_comp';
import EditTrack from '../popup/edit_track';
import axios from 'axios';

const options = [
  { label: 'Sửa', name:"Edit" ,icon: <EditIcon /> }, // Use icons for options
  { label: 'Xóa', name:"Delete", icon: <DeleteIcon /> },
  { label: 'Thêm vào playlist', name:"Add to playlist", icon: <PlaylistAddIcon /> },
];

const ITEM_HEIGHT = 48;

export default function LongMenu({ audioId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showPopup, setShowPopup] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [notify, setNotify] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddToPlaylist = () => {
    setShowPopup(true);
  };
  const handleDelete = async () => {
    // Show a confirmation dialog
    const confirmed = window.confirm('Bạn có chắc muốn xóa bài hát này ?');
  
    if (confirmed) {
      // User confirmed, proceed with the deletion
      try {
        await axios.delete(`http://audiocloud.asia:8000/v1/audio/removeAudio/${audioId}`);
        setNotify(true);
      } catch (error) {
        console.log(error);
      }
    }
  }
  const handleEdit = () => {
    setShowEdit(true);
  }

  const handleCloseEditPopup = () => {
    setShowEdit(false);
    console.log(showEdit);
  }

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
              if (option.name === 'Add to playlist') {
                handleAddToPlaylist();
              }else if(option.name === 'Delete'){
                handleDelete();
              }else if(option.name === 'Edit'){
                handleEdit();
              } else {
                handleClose();
              }
            }}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            {option.label}
          </MenuItem>
        ))}
        {showPopup ? <Popup_Playlist audioId={audioId} closePopup={handleClosePopup} /> : notify 
          ? <Notification message="Xóa bài hát thành công" closePopup={handleClosePopup}  type ="success"/>
          : showEdit ? <EditTrack audioId={audioId} closePopup={handleCloseEditPopup}/> : null }
      </Menu>
    </div>
  );
}
