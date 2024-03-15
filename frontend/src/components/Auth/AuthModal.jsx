import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "@mui/material";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import logo from '../../images/logo.png';
import "./authmodal.css"

const actionState = {
  signin: "signin",
  signup: "signup"
};

const AuthModal = () => {
  const { authModalOpen } = useSelector((state) => state.authModal);

  const dispatch = useDispatch();

  const [action, setAction] = useState(actionState.signin);

  useEffect(() => {
    if (authModalOpen) setAction(actionState.signin);
  }, [authModalOpen]);

  const handleClose = () => dispatch(setAuthModalOpen(false));

  const switchAuthState = (state) => setAction(state);

  return (
    <Modal
        open={authModalOpen}
        onClose={handleClose}
      >
      <div className="auth-modal">
        <div className="auth-modal-container">
          <div className="logo">
            <img src={logo} alt="Raveo" className="img-fluid" />
          </div>

          {action === actionState.signin && <SigninForm switchAuthState={() => switchAuthState(actionState.signup)} />}

          {action === actionState.signup && <SignupForm switchAuthState={() => switchAuthState(actionState.signin)} />}
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;