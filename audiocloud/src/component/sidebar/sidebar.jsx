import React from 'react'
import SidebarTop100 from './sidebar_top100';
import SidebarFav from './sidebar_fav';
import SidebarHistory from './sidebar_history';

const Sidebar = () => {
    return (
            <div className="blog_right_sidebar">
                <SidebarTop100/>
                <SidebarHistory/>
                <SidebarFav/>               
            </div>
    );
}
export default Sidebar;