import React from 'react'
const Sidebar = () => {
    return (
        <div className='col-lg-4'>
            <div className="blog_right_sidebar">
                <aside className="single_sidebar_widget popular_post_widget">
                    <h3 className="widget_title">Favourite</h3>
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
            </div>

            <div className="blog_right_sidebar">
                <aside className="single_sidebar_widget popular_post_widget">
                    <h3 className="widget_title">Related Track</h3>
                    <div className="media post_item">
                        <img src="img/post/post_1.png" alt="post" />
                        <div className="media-body">
                            <a href="single-blog.html">
                                <h3>From life was you fish...</h3>
                            </a>
                            <p>January 12, 2019</p>
                        </div>
                    </div>
                    <div className="media post_item">
                        <img src="img/post/post_2.png" alt="post" />
                        <div className="media-body">
                            <a href="single-blog.html">
                                <h3>The Amazing Hubble</h3>
                            </a>
                            <p>02 Hours ago</p>
                        </div>
                    </div>
                    <div className="media post_item">
                        <img src="img/post/post_3.png" alt="post" />
                        <div className="media-body">
                            <a href="single-blog.html">
                                <h3>Astronomy Or Astrology</h3>
                            </a>
                            <p>03 Hours ago</p>
                        </div>
                    </div>
                    <div className="media post_item">
                        <img src="img/post/post_4.png" alt="post" />
                        <div className="media-body">
                            <a href="single-blog.html">
                                <h3>Asteroids telescope</h3>
                            </a>
                            <p>01 Hours ago</p>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <a href=''>See more</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
export default Sidebar;