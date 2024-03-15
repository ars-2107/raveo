import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDisplay, faTabletScreenButton, faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import './quicklinks.css';

const OtherApps = () => {
  return (
    <div className="other-apps">
      <h3>Experience RAVEO on Other Devices</h3>
      <div className="device-icons">
         <div className="device">
          <FontAwesomeIcon className="device-icon" icon={faDisplay} size="3x" />
          <h4>Desktop</h4>
        </div>
        <div className="device">
          <FontAwesomeIcon className="device-icon" icon={faTabletScreenButton} size="3x" />
          <h4>Tablet</h4>
        </div>
        <div className="device">
          <FontAwesomeIcon className="device-icon" icon={faMobileScreen} size="3x" />
          <h4>Mobile</h4>
        </div>
      </div>
      <p>Access RAVEO on your desktop, tablet, or mobile device and enjoy a seamless experience.</p>
    </div>
  );
};

export default OtherApps;
