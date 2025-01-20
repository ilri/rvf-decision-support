import React from "react";
import { NavLink } from "react-router-dom";

function SubHeader() {
  return (
    <nav className="sub-header">
      <ul className="sub-header-list">
        <li className="sub-header-item">
          <NavLink to="/home" exact className="sub-header-link" activeclassname="active">
            Home
          </NavLink>
        </li>
        <li className="sub-header-item">
          <NavLink to="/rainfall" className="sub-header-link" activeclassname="active">
            Meteorological Data
          </NavLink>
        </li>
        <li className="sub-header-item">
          <NavLink to="/rvf-modelling" className="sub-header-link" activeclassname="active">
            RVF Modelling
          </NavLink>
        </li>
        {/* <li className="sub-header-item">
          <NavLink
            to="/climate-epidemic"
            className="sub-header-link"
            activeclassname="active"
          >
            Climate-epidemic interactions
          </NavLink> 
        </li> */}
        <li className="sub-header-item">
          <NavLink to="/decision-support" className="sub-header-link" activeclassname="active">
            Decision Support
          </NavLink>
        </li>
        <li className="sub-header-item">
          <NavLink to="/online-news-bulletin" className="sub-header-link" activeclassname="active">
            Online News Bulletin
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default SubHeader;
