import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4 footer-info">
              <div className="social-links mt-3">
                <h4>Follow Us</h4>
                <a href="https://twitter.com/ars2107_/" target="_blank" rel="noreferrer" className="twitter"><FontAwesomeIcon icon={faXTwitter} className="social-icon" /></a>
                <a href="https://www.facebook.com/ars2107/" target="_blank" rel="noreferrer" className="facebook"><FontAwesomeIcon icon={faFacebook} className="social-icon" /></a>
                <a href="https://www.instagram.com/ars2107_/" target="_blank" rel="noreferrer" className="instagram"><FontAwesomeIcon icon={faInstagram} className="social-icon" /></a>
                <a href="https://www.linkedin.com/in/apoorvsharma2107/" target="_blank" rel="noreferrer" className="linkedin"><FontAwesomeIcon icon={faLinkedin} className="social-icon" /></a>
              </div>
            </div>

            <div className="col-lg-8 col-md-8 footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/help">Help</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/terms-of-use">Terms of Use</a></li>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
                <li><a href="/other-apps">Apps</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="copyright">
         &copy; 2024 RAVEO. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
