import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import userApi from "../../api/modules/usersApi";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";
import "./authmodal.css"

const SigninForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const signinForm = useFormik({
    initialValues: {
      password: "",
      username: ""
    },
    onSubmit: async values => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      const { response, err } = await userApi.signin(values);
      setIsLoginRequest(false);

      if (response) {
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
      }else if (err) {
        setErrorMessage("Username or Password Incorrect");
      }
    }
  });

  return (
      <form className="signin-form" onSubmit={signinForm.handleSubmit}>
        <div className="sign-in">
          <input
            type="text"
            placeholder="username"
            name="username"
            value={signinForm.values.username}
            onChange={signinForm.handleChange}
            className="text-field"
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            value={signinForm.values.password}
            onChange={signinForm.handleChange}
            className="text-field"
          />
        </div>
  
        <button
          className="submit"
          type="submit"
          disabled={isLoginRequest}
        >
          Sign In
        </button>
  
        <button
          className="auth-switch"
          onClick={() => switchAuthState()}
        >
          or Sign Up
        </button>
  
        {errorMessage && (
          <div className="erro">
            <div className="alert alert-danger">{errorMessage}</div>
          </div>
        )}
      </form>
  );
};

export default SigninForm;