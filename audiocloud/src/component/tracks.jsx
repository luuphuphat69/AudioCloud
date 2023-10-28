import React, { useState, useEffect, useRef } from "react";
import jwt from 'jwt-decode';
import axios from "axios";
import LongMenu from "./menu/track_menu";

const Tracks = () => {
    const [data, setData] = useState(null);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const audioContext = useRef();
    const audioElements = useRef([]);
    const analyzers = useRef([]);
    const sourceNodes = useRef([]);
    const currentPlayingIndex = useRef(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://3.106.60.118:8000/getcookie', { withCredentials: true });
                const receivedToken = response.data;
                setToken(receivedToken);

                const _user = jwt(token);

                const responseData = await axios.get(`http://3.106.60.118:8000/v1/audio/getTracks/${_user?.userId}`);
                setData(responseData.data);
                setUser(_user);
            } catch (error) {
                // console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, [token]);

    useEffect(() => {
        audioContext.current = new AudioContext();
        return () => audioContext.current.close();
    }, []);

    const createAnalyser = () => {
        const analyser = audioContext.current.createAnalyser();
        analyser.fftSize = 256;
        // Waveform sensitive
        analyser.smoothingTimeConstant = 0.75;
        return analyser;
    };

    const visualizeData = (index) => {
        if (audioContext.current && audioElements.current[index]) {
            const audioElement = audioElements.current[index];
            if (!audioElement.paused) {
                const analyzer = analyzers.current[index];
                const dataArray = new Uint8Array(analyzer.frequencyBinCount);
                analyzer.getByteFrequencyData(dataArray);

                const canvas = document.getElementById(`canvas-${index}`);
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const barWidth = (canvas.width / dataArray.length) * 2;
                let barHeight;
                let x = 0;

                for (let i = 0; i < dataArray.length; i++) {
                    barHeight = dataArray[i] * 2;

                    // ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
                    ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);

                    // let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                    // gradient.addColorStop(0.2, "#2392f5");
                    // gradient.addColorStop(0.5, "#fe0095");
                    // gradient.addColorStop(1.0, "purple");
                    // ctx.fillStyle = gradient;
                    ctx.fillStyle = "#F6F1EE";

                    x += barWidth + 1;
                }

                requestAnimationFrame(() => visualizeData(index));
            }
        }
    };

    const clearCanvas = (index) => {
        const canvas = document.getElementById(`canvas-${index}`);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleAudioPlay = (audioUrl, index) => {
        if (audioContext.current && audioElements.current[index]) {
            const audioElement = audioElements.current[index];
            if (audioElement.paused) {
                audioElement.crossOrigin = "anonymous";
                audioElement.src = audioUrl;

                // Check if a source node and analyzer have already been connected
                if (!sourceNodes.current[index] || !analyzers.current[index]) {
                    const analyzer = createAnalyser();
                    analyzers.current[index] = analyzer;

                    const source = audioContext.current.createMediaElementSource(audioElement);
                    sourceNodes.current[index] = source;
                    source.connect(analyzer);
                    analyzer.connect(audioContext.current.destination);
                }

                // Pause the previously playing audio, if any
                if (currentPlayingIndex.current !== null) {
                    audioElements.current[currentPlayingIndex.current].pause();
                    clearCanvas(currentPlayingIndex.current);
                }

                // Set the current playing index to the new index
                currentPlayingIndex.current = index;

                audioElement.play();
                visualizeData(index);
            } else {
                // If the audio is already playing, pause it and clear the waveform
                audioElement.pause();
                audioElement.currentTime = 0;
                clearCanvas(index);
            }
        }
    };

    return (
        <section className="cart_area padding_top">
            <div className="container">
                {data?.map((item, index) => (
                    <div key={item.AudioId} className="d-block d-md-flex podcast-entry mb-5" style={{ backgroundColor: "#FFA33C" }}>
                        <div className="image-container p-3 mt-4">
                            {item.PhotoURL ? (
                                <img src={item.PhotoURL} style={{ width: '170px', height: '160px' }} alt="" />
                            ) : (
                                <img style={{ width: '170px', height: '160px' }} src="./src/assets/img/blur_img.png" alt="Default" />
                            )}
                            <div className="center-button">
                                <button className="btn-95 mb-4" onClick={() => handleAudioPlay(item.AudioURL, index)}>
                                    <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                        <g>
                                            <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="text" style={{width:"140px"}}>
                            <h5 className="font-weight-light p-3" style={{color:"#000"}}><a href={`/details/${item.AudioId}`}>{item.AudioName}</a></h5>
                            <h6 className="font-weight-light mb-4 ml-3" style={{color:"#000"}}>
                                 {item.UserDisplayname}
                            </h6>
                            <h6 className="font-weight-light mb-4 ml-3">
                                <p> Lượt nghe: {item.Plays}</p>
                            </h6>
                        </div>
                        <div className='ml-2' style={{ display: 'flex', width: "900px" }}>
                            <canvas id={`canvas-${index}`} width={900} height={250} />
                            <audio ref={audioRef => (audioElements.current[index] = audioRef)} />
                        </div>
                        <LongMenu audioId={item.AudioId}/>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Tracks;