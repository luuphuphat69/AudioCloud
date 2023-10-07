import React, {useState, useEffect} from "react";
import jwt from 'jwt-decode';
import axios from "axios";

const Tracks = () => {
    const [data, setData] = useState(null);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getcookie', { withCredentials: true });
                const receivedToken = response.data;
                setToken(receivedToken);
                
                const _user = jwt(token);
                
                const responseData = await axios.get(`http://localhost:8000/v1/audio/getTracks/${_user?.userId}`);
                setData(responseData.data);
                setUser(_user)
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, [token]);

    return(
        <section className="cart_area padding_top">
            <div className="container">
                {data?.map((item) => (
                    <div class="d-block d-md-flex podcast-entry mb-5" style={{backgroundColor: "#EDEDED"}}>
                        <div className="image-container p-3 mt-4">
                            {item.PhotoURL ? (
                                <img src={item.PhotoURL} style={{ width: '170px', height: '160px' }} alt="" />
                            ) : (
                                <img style={{ width: '170px', height: '160px' }} src="./src/assets/img/blur_img.png" alt="Default" />
                            )}
                            <div className="center-button">
                                <button className="btn-95 mb-4">
                                    <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                        <g>
                                            <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="text">
                            <h3 class="font-weight-light p-3"><a href="single-post.html">{item.AudioName}</a></h3>
                            <h5 class="font-weight-light mb-4 ml-3">
                                <a href='#'> {item.UserDisplayname}</a>
                            </h5>
                            <div className='ml-3 mt-5' style={{ display: 'flex' }}>
                                <button className='mr-3 mb-3' style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className='box'>
                                        <img className='mr-3 horizontal-button' src='../src/assets/img/icon/heart.png' style={{ width: "20px", height: "20px" }} />
                                    </div>
                                    <div className='box mt-3'>
                                        <p>Edit</p>
                                    </div>
                                </button>

                                <button className='mr-3 mb-3' style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className='box'>
                                        <img className='mr-3 horizontal-button' src='../src/assets/img/icon/playlist.png' style={{ width: "20px", height: "20px" }} />
                                    </div>
                                    <div className='box mt-3'>
                                        <p>Remove</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
export default Tracks