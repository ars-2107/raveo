import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import userApi from "../../api/modules/usersApi";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";

const SignupForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const signinForm = useFormik({
    initialValues: {
      password: "",
      username: "",
      displayName: "",
      confirmPassword: "",
      agreeToTerms: true,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "username minimum 8 characters")
        .required("* username is required"),
      password: Yup.string()
        .min(8, "password minimum 8 characters")
        .required("* password is required"),
      displayName: Yup.string()
        .min(8, "display name minimum 8 characters")
        .required("* display name is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "confirm password not match")
        .min(8, "confirm password minimum 8 characters")
        .required("* confirm password is required"),
      agreeToTerms: Yup.boolean()
        .oneOf([true], "* You must agree to the terms and conditions"),
    }),
    onSubmit: async values => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      const { response, err } = await userApi.signup(values);
      setIsLoginRequest(false);

      if (response) {
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
      }

      if (err) setErrorMessage(err.message);
    }
  });

  return (
    <form className="signup-form" onSubmit={signinForm.handleSubmit}>
      <div className="sign-up">
        <input
          type="text"
          placeholder="username"
          name="username"
          value={signinForm.values.username}
          onChange={signinForm.handleChange}
          className="text-field"
        />

        <input
          type="text"
          placeholder="display name"
          name="displayName"
          value={signinForm.values.displayName}
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

        <input
          type="password"
          placeholder="confirm password"
          name="confirmPassword"
          value={signinForm.values.confirmPassword}
          onChange={signinForm.handleChange}
          className="text-field"
        />

        <label>
          <p>By clicking "Sign Up", you are agreeing to our <a href="#" target="_blank" className="terms-and-conditions">terms and conditions</a></p>
        </label>
      </div>

      {signinForm.touched.username && signinForm.errors.username && (
          <div className="validation-error-message">{signinForm.errors.username}</div>
        )}
      {signinForm.touched.displayName && signinForm.errors.displayName && (
          <div className="validation-error-message">{signinForm.errors.displayName}</div>
        )}
      {signinForm.touched.password && signinForm.errors.password && (
          <div className="validation-error-message">{signinForm.errors.password}</div>
        )}
      {signinForm.touched.confirmPassword && signinForm.errors.confirmPassword && (
          <div className="validation-error-message">{signinForm.errors.confirmPassword}</div>
        )}
      {signinForm.touched.agreeToTerms && signinForm.errors.agreeToTerms && (
          <div className="validation-error-message">{signinForm.errors.agreeToTerms}</div>
        )}
      <button className="submit" type="submit" disabled={isLoginRequest}>
        Sign Up
      </button>

      <button className="auth-switch" onClick={() => switchAuthState()}>
        or Sign In
      </button>

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
    </form>
  );
};

export default SignupForm;