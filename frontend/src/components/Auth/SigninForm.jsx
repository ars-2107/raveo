import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
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
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .matches(/^[a-zA-Z0-9_.-]+$/, "Username can only contain alphanumeric characters, _, -, and .")
        .matches(/^[a-zA-Z0-9].*[a-zA-Z0-9_]$/, "Username must start with an alphanumeric character and cannot end with '.' or '-'")
        .min(8, "Username must be at least 8 characters")
        .required("Username is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async values => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      const { response, err } = await userApi.signin(values);
      setIsLoginRequest(false);

      if (response) {
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
      } else if (err) {
        setErrorMessage(err.message || "Something went wrong");
      }
    }
  });

  return (
    <form className="signin-form" onSubmit={signinForm.handleSubmit}>
      <div className="sign-in">
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={signinForm.values.username}
          onChange={signinForm.handleChange}
          onBlur={signinForm.handleBlur}
          className="text-field"
        />
        {signinForm.touched.username && signinForm.errors.username && (
          <div className="validation-error-message">
            {signinForm.errors.username}
          </div>
        )}
        
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          onBlur={signinForm.handleBlur}
          className="text-field"
        />

        <div className="password-container">
          {signinForm.touched.password && signinForm.errors.password && (
            <div className="validation-error-message">
              {signinForm.errors.password}
            </div>
          )}

          <button type="button" className="forgot-password">
            Forgot Password?
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <div className="submit-container">
        <button
          className="submit"
          type="submit"
          disabled={isLoginRequest}
        >
          Sign In
        </button>
      </div>

      <button
        className="auth-switch"
        type="button"
        onClick={() => switchAuthState()}
      >
        or Sign Up
      </button>
    </form>
  );
};

export default SigninForm;