import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

import './header.css';
import logo from '../../images/logo.png';
import Search from '../Search/Search';

import { setAuthModalOpen, setAuthState } from "../../redux/features/authModalSlice";
import UserMenu from "../Users/UserMenu";

const Header = () => {

  const { user } = useSelector((state) => state.user);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);

  const dispatch = useDispatch();

  const location = useLocation();

  const isPathActive = (path) => {
    return location.pathname === path;
  };
  
  useEffect(() => {
    const handleMobileNavToggle = () => {
      setMobileNavOpen((prevMobileNavOpen) => !prevMobileNavOpen);
    };

    const handleDropdownToggle = (e) => {
      if (isMobileNavOpen) {
        e.preventDefault();
        e.currentTarget.nextElementSibling.classList.toggle('dropdown-active');
      }
    };

    const mobileNavToggleIcon = document.querySelector('.mobile-nav-toggle');
    mobileNavToggleIcon.addEventListener('click', handleMobileNavToggle);

    const dropdownLinks = document.querySelectorAll('.navbar .dropdown > a');
    dropdownLinks.forEach((link) => link.addEventListener('click', handleDropdownToggle));

    return () => {
      mobileNavToggleIcon.removeEventListener('click', handleMobileNavToggle);
      dropdownLinks.forEach((link) => link.removeEventListener('click', handleDropdownToggle));
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (isMobileNavOpen) {
        navbar.classList.add('navbar-mobile');
      } else {
        navbar.classList.remove('navbar-mobile');
      }
    }
  }, [isMobileNavOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 550) {
        setSearchVisible(true);
      } else {
        setSearchVisible(false);
      }
    };
  
    window.addEventListener("resize", handleResize);
  
    handleResize();
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="header">
      <div className="container d-flex align-items-center justify-content-lg-between">
        <Link to="/" className="logo me-auto me-lg-0">
          <img src={logo} alt="Raveo" className="img-fluid" />
        </Link>

        {!isSearchVisible && <Search />}

        <nav className="navbar order-last order-lg-0">
          <ul>
            <li><Link to="/explore/movie" className={`nav-link ${isPathActive("/explore/movie") ? "active" : ""}`}>Movies</Link></li>
            <li><Link to="/explore/tv" className={`nav-link ${isPathActive("/explore/tv") ? "active" : ""}`} >TV Shows</Link></li>
            <li><Link to="/reviews" className={`nav-link ${isPathActive("/reviews") ? "active" : ""}`} >Lists</Link></li>
            <li><Link to="/reviews" className={`nav-link ${isPathActive("/reviews") ? "active" : ""}`} >Reviews</Link></li>
            <li><Link to="/reviews" className={`nav-link ${isPathActive("/reviews") ? "active" : ""}`} >Community</Link></li>
            {/* <li className="dropdown">
              <a href="#">
                <span>Drop Down</span> <FontAwesomeIcon icon={faChevronDown}  className="dropdown-icon" />
              </a>
              <ul>
                <li><a href="#">1</a></li>
                <li className="dropdown">
                  <a href="#">
                    <span>2</span> <FontAwesomeIcon icon={faChevronRight} className="dropdown-icon"/>
                  </a>
                  <ul>
                    <li><a href="#">2.1</a></li>
                    <li><a href="#">2.2</a></li>
                    <li><a href="#">2.3</a></li>
                    <li><a href="#">2.4</a></li>
                    <li><a href="#">2.5</a></li>
                  </ul>
                </li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">5</a></li>
              </ul>
            </li> */}
          </ul>
          <button className="mobile-nav-toggle">
            {!isMobileNavOpen && (
              <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z" fill="#eed110"/>
              </svg>
            )}
            {isMobileNavOpen && (
              <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8L8 16M8 8L16 16" stroke="#eed110" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </nav>
        
        {!user &&
        <button className="sign-in-btn" onClick={() => { dispatch(setAuthState('signin')); dispatch(setAuthModalOpen(true)); }}>
          Sign In
        </button>}
        {user && <UserMenu />}
      </div>
      {isSearchVisible && <Search />}
    </header>
  );
};

export default Header;
