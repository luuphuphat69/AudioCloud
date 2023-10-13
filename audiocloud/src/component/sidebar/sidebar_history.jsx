import React, {useState, useEffect} from "react";

const SidebarHis = () =>{
    return(
        <aside className="single_sidebar_widget popular_post_widget">
        <h3 className="widget_title">History</h3>
        <div className="media post_item">
            <img src="img/post/post_1.png" alt="post" />
            <div className="media-body">
                <a href="single-blog.html">
                    <h3>From life was you fish...</h3>
                </a>
            </div>
        </div>
        <div className="media post_item">
            <img src="img/post/post_2.png" alt="post" />
            <div className="media-body">
                <a href="single-blog.html">
                    <h3>The Amazing Hubble</h3>
                </a>
            </div>
        </div>
        <div className="media post_item">
            <img src="img/post/post_3.png" alt="post" />
            <div className="media-body">
                <a href="single-blog.html">
                    <h3>Astronomy Or Astrology</h3>
                </a>
            </div>
        </div>
        <div className="media post_item">
            <img src="img/post/post_4.png" alt="post" />
            <div className="media-body">
                <a href="single-blog.html">
                    <h3>Asteroids telescope</h3>
                </a>
            </div>
        </div>
        <div className='mt-4'>
            <a href=''>See more</a>
        </div>
    </aside>
    );
}
export default SidebarHis;