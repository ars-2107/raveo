import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

import './header.css';
import logo from '../../images/logo.png';
import Search from '../Search/Search';

import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import UserMenu from "../Users/UserMenu";

const Header = () => {

  const { user } = useSelector((state) => state.user);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

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

  return (
    <header className="header">
      <div className="container d-flex align-items-center justify-content-lg-between">
        <Link to="/" className="logo me-auto me-lg-0">
          <img src={logo} alt="Raveo" className="img-fluid" />
        </Link>

        <Search />

        <nav className="navbar order-last order-lg-0">
          <ul>
            <li><Link to="/explore/movie" className={`nav-link ${isPathActive("/explore/movie") ? "active" : ""}`}>Movies</Link></li>
            <li><Link to="/explore/tv" className={`nav-link ${isPathActive("/explore/tv") ? "active" : ""}`} >TV Shows</Link></li>
            {/* <li><a className="nav-link" href="#">Music</a></li>
            <li><a className="nav-link" href="#">Games</a></li> */}
            <li><Link to="/reviews" className="nav-link" >Reviews</Link></li>
            {/* <li><Link to="/news" className="nav-link" >News</Link></li> */}
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
          <FontAwesomeIcon icon={isMobileNavOpen ? faXmark : faBars} className="mobile-nav-toggle"/>
        </nav>
        
        {!user &&
        <button className="sign-up-btn" onClick={() => dispatch(setAuthModalOpen(true))}>
          Sign Up
        </button>}
        {user && <UserMenu />}
      </div>
    </header>
  );
};

export default Header;
