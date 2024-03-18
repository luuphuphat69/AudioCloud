import React, { useState, useEffect } from "react";
import { useAPlayer } from '../player_context';
import axios from "axios";
import jwt from 'jwt-decode';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';

const SidebarFav = () => {

    const cookies = new Cookies();
    const CookiesToken = cookies.get('token');

    const [userId, setUserId] = useState('');
    const [data, setData] = useState([]);
    const [audio, setAudio] = useState([]);

    const { initializeAPlayer } = useAPlayer();
    useEffect(() => {
        // Initialize APlayer when data is available
        initializeAPlayer(audio);
    }, [audio]);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const user = jwt(CookiesToken);
                setUserId(user.userId);
                const _response = await axios.get(`http://audiocloud.asia:8000/v1/fav/get-list-fav/${user.userId}`, { withCredentials: true });
                setData(_response.data);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, [userId]);

    useEffect(() => {
        console.log("Data: ", data); // Log the data here, within a separate useEffect
    }, [data]);

    const handleClick = async (audioURL, photoURL, audioName, userDisplayname) => {
        setAudio([{
            AudioURL: audioURL,
            PhotoURL: photoURL,
            AudioName: audioName,
            UserDisplayname: userDisplayname,
        }]);
    }

    return (
        <aside className="single_sidebar_widget popular_post_widget">
            <h3 className="widget_title">Yêu thích</h3>
            {data.slice(0, 3).map((item) => (
                <div className="media post_item" key={item.AudioId}>
                    <div className="image-container">
                        {item.PhotoURL ? (
                            <img src={item.PhotoURL} style={{ width: '90px', height: '90px' }} alt="" />
                        ) : (
                            <img style={{ width: '90px', height: '90px' }} src="../src/assets/img/blur_img.png" alt="Default" />
                        )}
                        <div className="center-button">
                            <button className="btn-95" style={{ width: "50px", height: "50px" }} onClick={() => handleClick(item.AudioURL, item.PhotoURL, item.AudioName, item.UserDisplayname)}>
                                <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                    <g>
                                        <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="media-body">
                        <Link to={`/details/${item.AudioId}`}>
                            <h3>{item.AudioName}</h3>
                        </Link>
                        <div>
                            <p>{item.UserDisplayname}</p>
                        </div>
                    </div>
                </div>
            ))}
            <div className='mt-4'>
                <Link to='/profile'>Xem thêm</Link>
            </div>
        </aside>
    );
}
export default SidebarFav;