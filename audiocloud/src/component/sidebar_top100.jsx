import React, { useState, useEffect } from 'react'
import { useAPlayer } from '../component/player_context';
import axios from 'axios';

const SidebarTop100 = () => {
    const apiEndpoint = 'http://localhost:8000/v1/audio/getTop100';
    const [data, setData] = useState([]);
    const [audio, setAudio] = useState([]);
    // Init Player
    const { initializeAPlayer } = useAPlayer();

    // const [likedItems, setLikedItems] = useState([]); // State to track liked items
    // const handleToggleLike = (audioURL) => {
    //     // Check if the item is already in the likedItems array
    //     if (likedItems.includes(audioURL)) {
    //         // If it's already liked, remove it
    //         setLikedItems(likedItems.filter(item => item !== audioURL));
    //     } else {
    //         // If it's not liked, add it
    //         setLikedItems([...likedItems, audioURL]);
    //     }
    // };

    const handleClick = async (audioURL, photoURL, audioName, userDisplayname) => {
        setAudio([{
            AudioURL: audioURL,
            PhotoURL: photoURL,
            AudioName: audioName,
            UserDisplayname: userDisplayname,
        }]);
    }

    useEffect(() => {
        // Initialize APlayer when data is available
        initializeAPlayer(audio);
    }, [audio]);

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

    return (
        <div className='col-lg-4'>
            <div className="blog_right_sidebar">
                <aside className="single_sidebar_widget popular_post_widget">
                    <h3 className="widget_title">TOP 100</h3>
                    <div className="scrollable-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {data.map((item) => (
                            <div class="d-block d-md-flex podcast-entry bg-white mb-5" data-aos="fade-up">
                                <div className="image-container">
                                    {item.PhotoURL ? (
                                        <img src={item.PhotoURL} style={{ width: '90px', height: '90px' }} alt="" />
                                    ) : (
                                        <img style={{ width: '90px', height: '90px' }} src="./src/assets/img/blur_img.png" alt="Default" />
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
                                <div class="text">
                                    <h3 class="font-weight-light ml-3"><a href="single-post.html">{item.AudioName}</a></h3>
                                    <p class="mb-1 ml-3">{item.UserDisplayname}</p>
                                    <div className='ml-3'>
                                        <img src='../src/assets/img/icon/heart.png' style={{ width: "20px", height: "20px" }} />
                                        <img className='ml-3' src='../src/assets/img/icon/plus.png' style={{ width: "20px", height: "20px" }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
export default SidebarTop100;