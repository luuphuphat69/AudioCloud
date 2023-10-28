import React, { useState, useEffect } from 'react'
import { useAPlayer } from '../player_context';
import jwt from 'jwt-decode';
import axios from 'axios';
import LongMenu from '../menu/audio_menu';

const SidebarTop100 = () => {
    const apiEndpoint = 'http://3.106.60.118:8000/v1/audio/getTop100';
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState('');

    // Init Player
    const { initializeAPlayer } = useAPlayer();

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://3.106.60.118:8000/getcookie', { withCredentials: true });
                const receivedToken = response.data;
                const user = jwt(receivedToken);
                setUserId(user.userId);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, []);

    useEffect(() => {
        // Fetch data from the API endpoint
        axios.get(apiEndpoint)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [apiEndpoint]);

    const handleLike = async (audioId) => {
        try {
            console.log(userId);
            await axios.put(`http://3.106.60.118:8000/v1/fav/add-to-fav/${audioId}/${userId}`);
        } catch (err) {
            console.log(err);
        }
    }

    const handleClick = (audioURL, photoURL, audioName, userDisplayname) => {
        // Initialize the player first
        initializeAPlayer([{
            AudioURL: audioURL,
            PhotoURL: photoURL,
            AudioName: audioName,
            UserDisplayname: userDisplayname,
        }]);
    }

    return (
        <aside className="single_sidebar_widget popular_post_widget">
            <h3 className="widget_title">TOP 100</h3>
            <div className="scrollable-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {data.map((item) => (
                    <div key={item.AudioId} class="d-block d-md-flex podcast-entry mb-5" data-aos="fade-up">
                        <div className="image-container">
                            {item.PhotoURL ? (
                                <img src={item.PhotoURL} style={{ width: '90px', height: '90px' }} alt="" />
                            ) : (
                                <img style={{ width: '90px', height: '90px' }} src="../src/assets/img/blur_img.png" alt="Default" />
                            )}
                            <div className="center-button">
                                <button className="btn-95" style={{ width: "50px", height: "50px"}} onClick={() => handleClick(item.AudioURL, item.PhotoURL, item.AudioName, item.UserDisplayname)}>
                                    <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                        <g>
                                            <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="text">
                            <h5 class="font-weight-light ml-3"><a href={`/details/${item.AudioId}`}>{item.AudioName}</a></h5>
                            <p class="mb-1 ml-3">{item.UserDisplayname}</p>
                        </div>
                        <div className='ml-auto mr-2'>
                            <LongMenu audioId={item.AudioId} handleLike={handleLike} />
                        </div>
                    </div>
                ))}
            </div>
        </aside>

    );
}
export default SidebarTop100;