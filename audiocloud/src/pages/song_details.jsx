import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import NavbarLoggedIn from "../component/navbar/navbar_loggedin";
import NavbarLoggedOut from "../component/navbar/navbar_loggedout";
import Notification from "../component/notify/notify_comp";
import Popup_Playlist from "../component/popup/add_to_playlist";
import SidebarTop100 from "../component/sidebar/sidebar_top100";
import jwt from "jwt-decode";
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import Cookies from 'universal-cookie';

const Details = () => {

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' })

    const { audioId } = useParams();
    const [audioDetails, setAudioDetails] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [comment, setComment] = useState('');
    const [data, setData] = useState([]);
    
    const [popup, setShowPopup] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const cookies = new Cookies();
    const CookiesToken = cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://54.161.251.210:8000/v1/comment/get-comments/${audioId}`);
                setData(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [audioId]);

    useEffect(() => {
        // Fetch the token when the component mounts
        const fetchToken = async () => {
            try {
                setToken(CookiesToken);
                checkLoginStatus();

                const _user = jwt(token);
                const userDataResponse = await axios.get(`http://54.161.251.210:8000/v1/user/get-info/${_user.userId}`, { withCredentials: true });
                setUser(userDataResponse.data);
            } catch (error) {
                // console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, [isLoggedIn]);

    const checkLoginStatus = () => {
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        // Fetch audio details based on the audioId
        axios.get(`http://54.161.251.210:8000/v1/audio/getAudioInfo/${audioId}`)
            .then(response => {
                setAudioDetails(response.data);
            })
            .catch(error => {
                console.error("Error fetching audio details:", error);
            });
    }, [audioId]);

    const handleSubmit = async (e) => {
         e.preventDefault();
        const formData = new URLSearchParams();

        formData.append('audioId', audioId);
        formData.append('commentContent', comment); // Use the comment state
        formData.append('photoURL', user.ProfilePic);
        formData.append('userId', user.UserId);
        formData.append('userDisplayname', user.Displayname);

        await axios.post('http://54.161.251.210:8000/v1/comment/post', formData, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const response = await axios.get(`http://54.161.251.210:8000/v1/comment/get-comments/${audioId}`);;
        const newComment = response.data[0];
        // Update the data state to include the new comment
        setData((prevData) => [newComment, ...prevData]);
        setComment('');
    }

    const handlePlaylist = async () => {
        setShowPopup(true);
    }
    const handleClosePopup = () => {
        setShowPopup(false);
    }

    const handleLike = async (audioId, userId) => {
        try {
            await axios.put(`http://54.161.251.210:8000/v1/fav/add-to-fav/${audioId}/${userId}`);
            setShowNotification(true);
        } catch (err) {
            console.log(err);
        }
    }

    const handleDownload = (downloadURL, fileName) => {
        const anchor = document.createElement('a');
        anchor.href = downloadURL;
        anchor.download = fileName; // Optional, set a custom filename
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const audioContext = useRef();
    const audioElement = useRef();
    const analyzer = useRef();
    const sourceNode = useRef();

    useEffect(() => {
        if (!audioContext.current) {
            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        }
    }, []);

    const createAnalyser = () => {
        const analyserInstance = audioContext.current.createAnalyser();
        analyserInstance.fftSize = 256;
        analyserInstance.smoothingTimeConstant = 0.75; // Adjust as needed
        return analyserInstance;
    };

    const visualizeData = () => {
        console.log("Visualizing data...");
        if (audioContext.current && audioElement.current) {
            const audioElementInstance = audioElement.current;
            if (!audioElementInstance.paused) {
                const analyzerInstance = analyzer.current;
                const dataArray = new Uint8Array(analyzerInstance.frequencyBinCount);
                analyzerInstance.getByteFrequencyData(dataArray);

                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const barWidth = (canvas.width / dataArray.length) * 2;
                let barHeight;
                let x = 0;

                for (let i = 0; i < dataArray.length; i++) {
                    if (isDesktopOrLaptop) {
                        barHeight = dataArray[i] * 2;
                    } else if (isTabletOrMobile) {
                        barHeight = dataArray[i] * 0.5;
                    }

                    // Set canvas drawing styles here
                    // let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                    // gradient.addColorStop(0.2, "#2392f5");
                    // gradient.addColorStop(0.5, "#fe0095");
                    // gradient.addColorStop(1.0, "purple");
                    ctx.fillStyle = "#F6F1EE";
                    //ctx.fillStyle = gradient;

                    ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
                    x += barWidth + 1;
                }

                requestAnimationFrame(visualizeData);
            }
        }
    };

    const clearCanvas = () => {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleAudioPlay = (audioUrl) => {
        if (audioContext.current && audioElement.current) {
            const audioElementInstance = audioElement.current;
            if (audioElementInstance.paused) {
                audioElementInstance.crossOrigin = "anonymous";
                audioElementInstance.src = audioUrl;

                if (!sourceNode.current || !analyzer.current) {
                    const analyzerInstance = createAnalyser();
                    analyzer.current = analyzerInstance;

                    const source = audioContext.current.createMediaElementSource(audioElementInstance);
                    sourceNode.current = source;
                    source.connect(analyzerInstance);
                    analyzerInstance.connect(audioContext.current.destination);
                }

                audioElementInstance.play();
                visualizeData();
            } else {
                audioElementInstance.pause();
                audioElementInstance.currentTime = 0;
                clearCanvas();
            }
        }
    };

    if (isDesktopOrLaptop) {
        return (
            <div className="container">
                {isLoggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}
                <div className="hero" style={{ marginTop: "110px" }}>
                    <div className="container-fluid">
                        <div className="row justify-content-between">
                            <div className="col" style={{ top: "70px" }}>
                                <div className="intro-excerpt">
                                    <div className="center-button" style={{ top: "55px", left: "45px" }}>
                                        <button className="btn-95 mb-4" onClick={() => handleAudioPlay(audioDetails.AudioURL)}>
                                            <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                                <g>
                                                    <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                                </g>
                                            </svg>
                                        </button>
                                    </div>
                                    <h3 style={{ color: "#000", marginLeft: "100px" }}>{audioDetails.AudioName}</h3>
                                    <h5 style={{ color: "#000", marginLeft: "100px" }}>{audioDetails.UserDisplayname}</h5>
                                    <div className='ml-2' style={{ display: 'flex', width: "900px" }}>
                                        <canvas id="canvas" width={850} height={235} />
                                        <audio ref={audioRef => (audioElement.current = audioRef)} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="hero-img-wrap">
                                    {audioDetails.PhotoURL ? (
                                        <img src={audioDetails.PhotoURL} alt="" />
                                    ) : (
                                        <img src="../src/assets/img/blur_img.png" alt="Default" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="form-control mt-5"
                        placeholder="Write a comment"
                    />

                </form>
                <div style={{ display: 'flex' }}>
                    <button className='mr-3 mb-3' style={{ display: 'flex', alignItems: 'center' }}>
                        <div className='box'>
                            <img className='mr-3 horizontal-button' src='../src/assets/img/icon/heart.png' style={{ width: "20px", height: "20px" }} />
                        </div>
                        <div className='box mt-3' onClick={() => handleLike(audioId, user.UserId)}>
                            <p>Likes</p>
                        </div>
                    </button>
                    <button className='mr-3 mb-3' style={{ display: 'flex', alignItems: 'center' }}>
                        <div className='box'>
                            <img className='mr-3 horizontal-button' src='../src/assets/img/icon/playlist.png' style={{ width: "20px", height: "20px" }} />
                        </div>
                        <div className='box mt-3' onClick={handlePlaylist}>
                            <p>Add to playlist</p>
                        </div>
                    </button>
                    <button className='mr-3 mb-3' style={{ display: 'flex', alignItems: 'center' }}>
                        <div className='box'>
                            <img className='mr-3 horizontal-button' src='../src/assets/img/icon/download.png' style={{ width: "20px", height: "20px" }} />
                        </div>
                        <div className='box mt-3' onClick={() => handleDownload(audioDetails.AudioURL, audioDetails.AudioName)}>
                            <p>Download</p>
                        </div>
                    </button>
                </div>
                <div className="row">
                    <div className="col-lg-8">
                        {data && data.map((item) => (
                            <div key={item.CommentId} className="comment-container">
                                {item.PhotoURL !== 'undefined' ? (
                                    <img src={item.PhotoURL} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                                ) : (
                                    <img src="../src/assets/img/blur_img.png" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                                )}
                                <div className="comment-details">
                                    <p>{item.DateComment}</p>
                                    <div>{item.CommentContent}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col">
                        <SidebarTop100 />
                    </div>
                </div>
                {popup ? <Popup_Playlist audioId={audioId} closePopup={handleClosePopup} /> : null}
                {showNotification && (
                    <Notification
                        message="You liked this item!"
                        type="success" // Set the type of notification (success, info, warning, error)
                        onClose={() => setShowNotification(false)} // Close the notification
                    />
                )}
            </div>
        );
    } else if (isTabletOrMobile) {
        return (
            <div className="container">
                {isLoggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}
                <div className="hero" style={{ marginTop: "200px"}}>
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div style={{ top: "70px", height: '150px' }}>
                                <div className="intro-excerpt">
                                    <div className="audio-player" style={{ display: "flex", alignItems: "center", marginTop: "50px" }}>
                                        <button className="btn-95" onClick={() => handleAudioPlay(audioDetails.AudioURL)}>
                                            <svg fill="#000000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="60" height="60" viewBox="0 0 60 60">
                                                <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z" />
                                            </svg>
                                        </button>
                                        <div style={{ marginLeft: "10px" }}>
                                            <h3 style={{ color: "#000" }}>{audioDetails.AudioName}</h3>
                                            <h5 style={{ color: "#000" }}>{audioDetails.UserDisplayname}</h5>
                                        </div>
                                        <div style={{ marginLeft: "auto" }}>
                                            {audioDetails.PhotoURL ? (
                                                <img src={audioDetails.PhotoURL} alt="" width='150px' />
                                            ) : (
                                                <img src="../src/assets/img/blur_img.png" width='100px' alt="Default" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="audio-player mt-3">
                                        <canvas id="canvas" width={330} height={75} />
                                        <audio ref={audioRef => (audioElement.current = audioRef)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="form-control mt-3"
                        placeholder="Write a comment"
                    />
                </form>
                <div className="actions" style={{ display: "flex" }}>
                    <button className="mr-2" style={{ color: '#000' }} onClick={() => handleLike(audioId, user.UserId)}>
                        <img src="../src/assets/img/icon/heart.png" width="20" height="20" alt="Like" />
                        Thích
                    </button>
                    <button className="mr-2" onClick={handlePlaylist} style={{ color: '#000' }}>
                        <img src="../src/assets/img/icon/playlist.png" width="20" height="20" alt="Add to playlist" />
                        <br></br>
                        Thêm vào Playlist
                    </button>
                    <button className="mr-2" onClick={() => handleDownload(audioDetails.AudioURL, audioDetails.AudioName)} style={{ color: '#000' }}>
                        <img src="../src/assets/img/icon/download.png" width="20" height="20" alt="Download" />
                        <br></br>
                        Tải xuống
                    </button>
                </div>
                <div className="comments mt-4" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {data && data.map(item => (
                        <div key={item.CommentId} className="comment-container">
                            {item.PhotoURL !== 'undefined' ? (
                                <img src={item.PhotoURL} width="50" height="50" style={{ borderRadius: "50%" }} alt="User" />
                            ) : (
                                <img src="../src/assets/img/blur_img.png" width="50" height="50" style={{ borderRadius: "50%" }} alt="User" />
                            )}
                            <div className="comment-details">
                                <p>{item.DateComment}</p>
                                <div>{item.CommentContent}</div>
                            </div>
                        </div>
                    ))}
                </div>
                {popup ? <Popup_Playlist audioId={audioId} closePopup={handleClosePopup} /> : null}
                {showNotification && (
                    <Notification
                        message="Bạn đã thích bài hát này!"
                        type="success"
                        onClose={() => setShowNotification(false)}
                    />
                )}
            </div>
        );
    }
}
export default Details;