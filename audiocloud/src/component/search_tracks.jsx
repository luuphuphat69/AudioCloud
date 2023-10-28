import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API requests
import jwt from 'jwt-decode';
import { useAPlayer } from '../component/player_context';
import ReactPaginate from 'react-paginate';
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons";
import Popup_Playlist from '../component/popup/add_to_playlist'

const Search_Tracks = ({ searchResults }) => {

    // Paging
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;

    const [data, setData] = useState(searchResults); // Initialize with searchResults
    const [audio, setAudio] = useState([]);
    const [userId, setUserId] = useState('');

    const offset = currentPage * itemsPerPage;
    const paginatedData = data.slice(offset, offset + itemsPerPage);

    const [showNotification, setShowNotification] = useState(false);
    const [showPoppupPlaylist, setShowPopupPlaylist] = useState(false);

    const handleLikeClick = () => {
        setShowNotification(true); // Show the notification
    };

    // Handle button clicked
    const handleClick = async (audioId, audioURL, audioname, artist, coverImg) => {
        const newAudio = ([{
            AudioId: audioId,
            AudioName: audioname,
            UserDisplayname: artist,
            AudioURL: audioURL,
            PhotoURL: coverImg
        }]);
        setAudio(newAudio);
        updatePlays(audio[0].AudioId);
    }

    useEffect(() => {
        const fectchUser = async () => {
            const response = await axios.get('http://3.106.60.118:8000/getcookie', { withCredentials: true });
            const receivedToken = response.data;
            const user = jwt(receivedToken);
            setUserId(user.userId);
        }
        fectchUser();
    }, [userId]);

    const handleLike = async (audioId) => {
        try {
            await axios.put(`http://3.106.60.118:8000/v1/fav/add-to-fav/${audioId}/${userId}`);
            handleLikeClick();
        } catch (err) {
            console.log(err);
        }
    }

    const updatePlays = async (audioId) => {
        try {
            const response = await axios.put(`http://3.106.60.118:8000/v1/audio/update-plays/${audioId}`);
        } catch (error) {
            console.log(error);
        }
    }

    // Init player
    const { initializeAPlayer } = useAPlayer();
    useEffect(() => {
        if (audio) {
            initializeAPlayer(audio);
        }
    }, [audio]);

    useEffect(() => {
        if (searchResults) {
            // Update the data state when searchResults prop changes
            setData(searchResults);
        }
    }, [searchResults]);

    const handleDownload = (downloadURL, fileName) => {
        const anchor = document.createElement('a');
        anchor.href = downloadURL;
        anchor.download = fileName; // Optional, set a custom filename
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const handlePlaylistClick = () => {
        setShowPopupPlaylist(true);
    }
    const closePopup = () => {
        // Close popup
        setShowPopupPlaylist(false);
    }
    return (
        <div>
            {paginatedData.map((item) => (
                <div class="d-block d-md-flex podcast-entry mb-5" style={{ backgroundColor: "#EDEDED" }}>
                    <div className="image-container p-3 mt-4">
                        {item.PhotoURL ? (
                            <img src={item.PhotoURL} style={{ width: '170px', height: '160px' }} alt="" />
                        ) : (
                            <img style={{ width: '170px', height: '160px' }} src="./src/assets/img/blur_img.png" alt="Default" />
                        )}
                        <div className="center-button">
                            <button className="btn-95 mb-5" onClick={() => handleClick(item.AudioId, item.AudioURL, item.AudioName, item.UserDisplayname, item.PhotoURL)}>
                                <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                    <g>
                                        <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="text">
                        <h3 class="font-weight-light p-3">
                            <a href={`/details/${item.AudioId}`}>{item.AudioName}</a>
                        </h3>
                        <h5 class="font-weight-light mb-4 ml-3">
                            By: {item.UserDisplayname}
                        </h5>
                        <p className='ml-3'>Plays: {item.Plays}</p>
                        <div className='ml-3' style={{ display: 'flex' }}>
                            <button className='mr-3 mb-3' style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleLike(item.AudioId)}>
                                <div className='box'>
                                    <img className='mr-3 horizontal-button' src='../src/assets/img/icon/heart.png' style={{ width: "20px", height: "20px" }} />
                                </div>
                                <div className='box mt-3'>
                                    <p>Likes</p>
                                </div>
                            </button>

                            <button className='mr-3 mb-3' onClick={handlePlaylistClick} style={{ display: 'flex', alignItems: 'center' }}>
                                <div className='box'>
                                    <img className='mr-3 horizontal-button' src='../src/assets/img/icon/playlist.png' style={{ width: "20px", height: "20px" }} />
                                </div>
                                <div className='box mt-3'>
                                    <p>Add to playlist</p>
                                </div>
                            </button>
                            <button className='mr-3 mb-3' style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleDownload(item.AudioURL, item.AudioName)}>
                                <div className='box'>
                                    <img className='mr-3 horizontal-button' src='../src/assets/img/icon/download.png' style={{ width: "20px", height: "20px" }} />
                                </div>
                                <div className='box mt-3'>
                                    <p>Download</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    {showPoppupPlaylist && <Popup_Playlist audioId={item.AudioId} closePopup={closePopup} />}
                    {showNotification && (
                        <Notification
                            message="You liked this item!"
                            type="success" // Set the type of notification (success, info, warning, error)
                            onClose={() => setShowNotification(false)} // Close the notification
                        />

                    )}
                </div>
            ))}
            <div style={{ marginBottom: "100px" }}>
                <ReactPaginate
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    activeClassName={"active"}
                    onPageChange={(event) => setCurrentPage(event.selected)}
                    pageCount={Math.ceil(data.length / itemsPerPage)}
                    breakLabel="..."
                    previousLabel={
                        <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
                            <AiFillLeftCircle />
                        </IconContext.Provider>
                    }
                    nextLabel={
                        <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
                            <AiFillRightCircle />
                        </IconContext.Provider>
                    }
                />
            </div>
        </div>
    );
}
export default Search_Tracks