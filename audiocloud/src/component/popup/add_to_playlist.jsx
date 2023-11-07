import React, { useState, useEffect, useRef } from "react";
import Tab_AddToPlaylist from "../tab/tab_addtoplaylist";
import Tab_CreatePlaylist from "../tab/tab_createaplaylist";
import { useMediaQuery } from 'react-responsive';
const Popup_Playlist = ({audioId, closePopup }) => {

  const [activeTab, setActiveTab] = useState("add"); // Set the default tab to "add"
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' })

  const tabContentRef = useRef(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleClick = (event) => {
    event.stopPropagation();
  }

  useEffect(() => {
    tabContentRef.current.addEventListener("hidden.bs.tab", function (e) {
      const targetTab = e.target.getAttribute("href").replace("#", "");
      handleTabClick(targetTab);
    });
  }, []);

  if(isDesktopOrLaptop){
    return (
      <div className="overlay" onClick={closePopup}>
        <div className="container card card-custome shadow d-flex justify-content-center mt-5" onClick={handleClick}>
          <ul className="nav nav-pills mb-3 shadow-sm" role="tablist">
            <li className="nav-item" role="presentation">
              <a
                className={`nav-link ${activeTab === "add" ? "active" : ""}`}
                id="addtoplaylist"
                style={{cursor: "pointer"}}
                role="tab"
                aria-selected={activeTab === "add"}
                onClick={() => handleTabClick("add")}
              >
                THÊM VÀO PLAYLIST
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className={`nav-link ${activeTab === "create" ? "active" : ""}`}
                id="createplaylist"
                role="tab"
                style={{cursor: "pointer"}}
                aria-selected={activeTab === "create"}
                onClick={() => handleTabClick("create")}
              >
                TẠO PLAYLIST MỚI
              </a>
            </li>
          </ul>
  
          <div className="tab-content" ref={tabContentRef}>
            <div
              className={`tab-pane fade ${
                activeTab === "add" ? "show active" : ""
              }`}
              id="addtoplaylist" // Set the id to match the tab link
              role="tabpanel">
              <ul>
                <Tab_AddToPlaylist audioId = {audioId}/>
              </ul>
            </div>
  
            <div
              className={`tab-pane fade ${
                activeTab === "create" ? "show active" : ""
              }`}
              id="createplaylist" // Set the id to match the tab link
              role="tabpanel">
              <div className="form-group addinfo">
              <ul>
                <Tab_CreatePlaylist/>
              </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }else if(isTabletOrMobile){
    return (
    <div className="overlay" onClick={closePopup}>
      <div className="containerMobile card card-customeMobile shadow d-flex justify-content-center" onClick={handleClick}>
        <ul className="nav nav-pills mb-3 shadow-sm" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link ${activeTab === "add" ? "active" : ""}`}
              id="addtoplaylist"
              style={{cursor: "pointer"}}
              role="tab"
              aria-selected={activeTab === "add"}
              onClick={() => handleTabClick("add")}
            >
              THÊM VÀO PLAYLIST
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link ${activeTab === "create" ? "active" : ""}`}
              id="createplaylist"
              role="tab"
              style={{cursor: "pointer"}}
              aria-selected={activeTab === "create"}
              onClick={() => handleTabClick("create")}
            >
              TẠO PLAYLIST MỚI
            </a>
          </li>
        </ul>

        <div className="tab-content p-3" ref={tabContentRef}>
          <div
            className={`tab-pane fade ${
              activeTab === "add" ? "show active" : ""
            }`}
            id="addtoplaylist" // Set the id to match the tab link
            role="tabpanel">
            <ul>
              <Tab_AddToPlaylist audioId = {audioId}/>
            </ul>
          </div>

          <div
            className={`tab-pane fade ${
              activeTab === "create" ? "show active" : ""
            }`}
            id="createplaylist" // Set the id to match the tab link
            role="tabpanel">
            <div className="form-group addinfo">
            <ul>
              <Tab_CreatePlaylist/>
            </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }
};

export default Popup_Playlist;