import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { setAuthModalOpen, setAuthState } from "../../redux/features/authModalSlice";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import logo from '../../images/logo.png';
import "./authmodal.css";

Modal.setAppElement('#root');

const AuthModal = () => {
  const { authModalOpen, authState } = useSelector((state) => state.authModal);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authModalOpen) {
      if (!authState) {
        dispatch(setAuthState("signin"));
      }
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => document.body.classList.remove("modal-open");
  }, [authModalOpen, authState, dispatch]);

  const handleClose = () => dispatch(setAuthModalOpen(false));

  const switchAuthState = (state) => {
    dispatch(setAuthState(state));
  };

  return (
    <Modal
      isOpen={authModalOpen}
      onRequestClose={handleClose}
      className="auth-modal"
      overlayClassName="auth-modal-overlay"
    >
      <div className="auth-modal-container">

        <button className="close-button" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="logo">
          <img src={logo} alt="Raveo" className="img-fluid" />
        </div>

        {authState === "signin" && (
          <SigninForm switchAuthState={() => switchAuthState("signup")} />
        )}

        {authState === "signup" && (
          <SignupForm switchAuthState={() => switchAuthState("signin")} />
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;