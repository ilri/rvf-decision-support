import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { BsChevronDown } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import Health from "../../assests/Images/oneHealth.png";

function Header() {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const naviagte = useNavigate();
  const userDetails = localStorage.getItem("userDetails");
  // console.log({ userDetails }, "userDetails");
  const onHandleLogOut = () => {
    localStorage.removeItem("userDetails");
    naviagte("/");
  };
  const isLogin = location.pathname === "/login";
  return (
    <Navbar
      className={isLogin ? "custom-navbar login-header-height" : "custom-navbar"}
      dark
      expand="md"
    >
      <NavbarBrand className="d-flex align-items-center header-div">
        <img src={Health} alt="Logo" className="logo-image" />
        <span className="logo-text">
          Decision support tool for prevention & control of RVF epizootic
        </span>
      </NavbarBrand>

      <Nav className="ml-auto nav-container" navbar>
        {userDetails ? (
          <Dropdown
            isOpen={openDropdown}
            toggle={() => setOpenDropdown(!openDropdown)}
            className="dashboard-earlyaction"
          >
            <DropdownToggle
              className="test123"
              aria-controls="example-collapse-text"
              aria-expanded={!openDropdown}
              style={{ border: "2px solid red" }}
            >
              <div className="login-user-btn">
                <BiUser size={22} className="mr-2" />
              </div>
              <BsChevronDown
                onClick={() => setOpenDropdown(!openDropdown)}
                className="login-down-arrow"
              />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className="profile-dropdown" onClick={() => onHandleLogOut()}>
                <IoLogOutOutline className="aware-header-icon" />
                <p className="mb-0">Logout</p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          ""
        )}
      </Nav>
    </Navbar>
  );
}

export default Header;
