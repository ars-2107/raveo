import React, { useEffect } from 'react';

import 'bootstrap-icons/font/bootstrap-icons.css';
import './backtotop.css';

const Element = () => {
  useEffect(() => {
    const select = (w, all = false) => {
      w = w.trim();
      if (all) {
        return [...document.querySelectorAll(w)];
      } else {
        return document.querySelector(w);
      }
    };

    const onscroll = (w, listener) => {
      w.addEventListener('scroll', listener);
    };

    let backtotop = select('.back-to-top');
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active');
        } else {
          backtotop.classList.remove('active');
        }
      };
      window.addEventListener('load', toggleBacktotop);
      onscroll(document, toggleBacktotop);
    }
  }, []);

  return (
    <button
      className="back-to-top d-flex align-items-center justify-content-center"
      onClick={() => window.scrollTo(0, 0)}
    >
      <i className="bi bi-arrow-up-short"></i>
    </button>
  );
};

export default Element;
