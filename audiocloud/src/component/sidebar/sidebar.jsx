import React from 'react'
import SidebarTop100 from './sidebar_top100';
import SidebarFav from './sidebar_fav';
import SidebarHis from './sidebar_history';

const Sidebar = () => {
    return (
            <div className="blog_right_sidebar">
                <SidebarTop100/>
                <SidebarHis/>
                <SidebarFav/>               
            </div>
    );
}
export default Sidebar;