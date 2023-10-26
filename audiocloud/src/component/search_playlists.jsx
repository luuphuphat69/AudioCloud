import React, { useState, useEffect } from "react";
import { useAPlayer } from '../component/player_context';
const Search_Playlists = ({ playlistResults }) => {

    const [data, setData] = useState(playlistResults);
    const { initializeAPlayer } = useAPlayer();
    const handlePlay = (listAudio) => {
        initializeAPlayer(listAudio);
    }
    return (
        <div style={{}}>
            {data.map((item) => (
                <div class="d-block d-md-flex podcast-entry" style={{ backgroundColor: "#EDEDED", marginBottom:"400px"}}>
                    <div className="image-container p-3 mt-1">
                        <img src="../src/assets/img/playlist.jpeg" />
                        <div className="center-button">
                            <button className="btn-95 " onClick={() => handlePlay(item.ListAudio)}>
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
                            {item.Title}
                        </h3>
                        <h5 class="font-weight-light p-3">
                            {item.Genre}
                        </h5>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default Search_Playlists