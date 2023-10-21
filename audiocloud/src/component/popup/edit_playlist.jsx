import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

const EditPlaylist_Popup = ({ playlistId, closePopup }) => {

    const [data, setData] = useState([]);
    const [isPublic, setIsPublic] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/v1/playlist/getInfo/${playlistId}`);
                setData(response.data.ListAudio); // Access ListAudio property in response.data
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [playlistId]);

    const popupFormStyle = {
        background: '#F0F0F0',
        width: '41rem',
        height: '85vh',
    };
    const handleRadioChange = (e) => {
        setIsPublic(e);
        console.log(isPublic);
    };
    return (
        <div className="overlay" onClick={closePopup}>
            <div className="container card card-custome shadow d-flex justify-content-center mt-5">
                <div className="popup-form p-2" style={popupFormStyle}>
                    <form method="POST">
                        <div className="container_upload">
                            {/* Title Input */}
                            <input type="text" id="title" className="form-control" placeholder="Title" required />
                            {/* Genre Input */}
                            <input type="text" id="genre" className="form-control mt-2" placeholder="Genre" />
                            {/* Access Input */}
                            <label className="mt-3 ml-1">Access:</label>
                            <label className="radio-label mt-3 ml-3">
                                <input
                                    type="radio"
                                    name="access"
                                    value="public"
                                    onChange={() => handleRadioChange(true)} required />
                                Public
                            </label>
                            <label className="radio-label ml-5 mt-3">
                                <input
                                    type="radio"
                                    name="access"
                                    value="private"
                                    onChange={() => handleRadioChange(false)} />
                                Private
                            </label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button className="btn btn-primary mt-3" type="button">Save</button>
                        </div>
                    </form>
                    <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                        {data?.map((item) => (
                            <div className='d-block d-md-flex podcast-entry mb-3'>
                                <div className='image-container'>
                                    <img src='../src/assets/img/playlist.jpeg' style={{ width: "70px", height: "70px" }} />
                                </div>

                                <div className="text ml-2">
                                    <h5>{item.AudioName}</h5>
                                    <h6 className='font-weight-light'>{item.Genre}</h6>
                                </div>
                                <button className='mt-2' onClick={() => handleClick(audioId, item.PlaylistId)} style={{ marginLeft: "auto", height: "50px", color: "#000" }}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EditPlaylist_Popup;