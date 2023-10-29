import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import NavbarLoggedIn from "../component/navbar/navbar_loggedin";
import NavbarLoggedOut from "../component/navbar/navbar_loggedout";
import Notification from "../component/notify/notify_comp";
import Popup_Playlist from "../component/popup/add_to_playlist";
import SidebarTop100 from "../component/sidebar/sidebar_top100";
import jwt from "jwt-decode";
import axios from 'axios';

const Details = () => {
    const { audioId } = useParams();
    const [audioDetails, setAudioDetails] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [comment, setComment] = useState('');
    const [data, setData] = useState([]);
    const [popup, setShowPopup] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://54.206.75.221:8000/v1/comment/get-comments/${audioId}`);
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
                const response = await axios.get('http://54.206.75.221:8000/get-cookies', { withCredentials: true });
                const receivedToken = response.data;
                setToken(receivedToken);
                checkLoginStatus();

                const _user = jwt(token);
                const userDataResponse = await axios.get(`http://54.206.75.221:8000/v1/user/get-info/${_user.userId}`, { withCredentials: true });
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
        axios.get(`http://54.206.75.221:8000/v1/audio/getAudioInfo/${audioId}`)
            .then(response => {
                setAudioDetails(response.data);
            })
            .catch(error => {
                console.error("Error fetching audio details:", error);
            });
    }, [audioId]);

    const handleSubmit = async () => {
        const formData = new URLSearchParams();

        formData.append('audioId', audioId);
        formData.append('commentContent', comment); // Use the comment state
        formData.append('photoURL', user.ProfilePic);
        formData.append('userId', user.UserId);
        formData.append('userDisplayname', user.Displayname);

        await axios.post('http://54.206.75.221:8000/v1/comment/post', formData, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    }

    const handlePlaylist = async () => {
        setShowPopup(true);
    }
    const handleClosePopup = () => {
        setShowPopup(false);
    }

    const handleLike = async (audioId, userId) => {
        try {
            await axios.put(`http://54.206.75.221:8000/v1/fav/add-to-fav/${audioId}/${userId}`);
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
                    barHeight = dataArray[i] * 2;

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
}
export default Details;