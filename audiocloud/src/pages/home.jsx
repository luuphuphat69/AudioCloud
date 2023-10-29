import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NavbarLoggedOut from '../component/navbar/navbar_loggedout';
import NavbarLoggedIn from '../component/navbar/navbar_loggedin';
import Sidebar from '../component/sidebar/sidebar';
import SidebarTop100 from '../component/sidebar/sidebar_top100';
import { useAPlayer } from '../component/player_context';

axios.defaults.withCredentials = true;

const Home = () => {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    const items = [
        { id: 'Pop', text: 'https://images.pexels.com/photos/1370545/pexels-photo-1370545.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        { id: 'Ballad', text: 'https://images.pexels.com/photos/838696/pexels-photo-838696.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        { id: 'Rock', text: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        { id: 'Rap', text: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        { id: 'Funk', text: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        { id: 'Lofi', text: 'https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        { id: 'EDM', text: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    ];

    const [data, setData] = useState([]);
    const [genre, setGenre] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken] = useState(null);

    const { initializeAPlayer } = useAPlayer();

    const handleImageClick = (newGenre) => {
        if(genre == null){
            setGenre(newGenre); // Set the genre based on the clicked image
        }else{
            setGenre(null);
        }
    };

    useEffect(() => {
        // Fetch the token when the component mounts
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://54.206.75.221:8000/get-cookies', { withCredentials: true }); // Get Cookies data
                const receivedToken = response.data;
                setToken(receivedToken);

                // Check the login status once the token is available
                checkLoginStatus();
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, [isLoggedIn]);

    const checkLoginStatus = () => {
        // Check if the token exists and update the login status
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        // Fetch top 50 audio tracks for the selected genre
        const fetchData = async () => {
            if (genre) {
                try {
                    console.log("UseEffeect", genre);
                    const response = await axios.get(`http://54.206.75.221:8000/v1/audio/getTop50/${genre}`);
                    setData(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData();
    }, [genre]);

    useEffect(() => {
        // Initialize APlayer when data is available
        console.log(data);
        initializeAPlayer(data);
    }, [data]);
    return (

        <section className="product_list best_seller section_padding">
            {isLoggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}
            <div className='row'>
                <div className='col-lg-8 mb-5 mb-lg-0'>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-12">
                                <div className="section_tittle text-center">
                                    <h2>Xếp hạng: Top 50</h2>
                                    <span>Những bài hát được nghe nhiều nhất trên AudioCloud</span>
                                </div>
                                <Slider {...sliderSettings}>
                                    {items.map((item) => (
                                        <div className="col-md-3" key={item.id}>
                                            <a className="album-poster" onClick={() => handleImageClick(item.id)}>
                                                <div className="image-container slider-item">
                                                    <img src={item.text} alt="" />
                                                    <div className="center-button">
                                                        <button className="btn-95">
                                                            <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlSpace="http://www.w3.org/2000/svg" xmlspace: xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                                                <g>
                                                                    <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                                                </g>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </a>
                                            <h4>TOP50 <span>{item.id}</span></h4>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>

                    <div className="container mt-5">
                        <div className="row justify-content-center">
                            <div className="col-lg-12">
                                <div className="section_tittle text-center mt-5">
                                    <h2>Bảng xếp hạng: Mới & Hot</h2>
                                    <span>Các bản nhạc đang nổi bật trên AudioCloud</span>
                                </div>
                                <Slider {...sliderSettings}>
                                    {items.map((item) => (
                                        <div className="col-md-3" key={item.id}>
                                            <a className="album-poster" onClick={() => handleImageClick(item.id)}>
                                                <div className="image-container slider-item">
                                                    <img src={item.text} alt="" />
                                                    <div className="center-button">
                                                        <button className="btn-95">
                                                            <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlSpace="http://www.w3.org/2000/svg" xmlspace: xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                                                <g>
                                                                    <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                                                </g>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </a>
                                            <h4>TOP50 <span>{item.id}</span></h4>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>

                    <div className="container mt-5">
                        <div className="row justify-content-center">
                            <div className="col-lg-12">
                                <div className="section_tittle text-center mt-5">
                                    <h2>Nghệ sĩ bạn nên biết</h2>
                                    <span>Top những bài hát từ những nghệ sĩ nổi bật</span>
                                </div>
                                <Slider {...sliderSettings}>
                                    {items.map((item) => (
                                        <div className="col-md-3" key={item.id}>
                                            <a className="album-poster">
                                                <div className="image-container slider-item">
                                                    <img src={item.text} alt="" />
                                                    <div className="center-button">
                                                        <button className="btn-95" onClick={() => handleImageClick(item.id)}>
                                                            <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlSpace="http://www.w3.org/2000/svg" xmlspace: xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                                                <g>
                                                                    <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                                                </g>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </a>
                                            <h4>TOP50 <span>{item.id}</span></h4>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4'>
                    <div className="blog_right_sidebar">
                    {isLoggedIn ? <Sidebar /> : <SidebarTop100 />}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;