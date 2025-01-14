import { useFormik } from "formik";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import ReCaptcha from "react-google-recaptcha";
import userApi from "../../api/modules/usersApi";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";
import "./authmodal.css";

const SignupForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();
  const recaptchaRef = useRef(null);

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [recaptchaToken, setRecaptchaToken] = useState();

  const signupForm = useFormik({
    initialValues: {
      displayName: "",
      email: "",
      username: "",
      password: "",
      agreeToTerms: true,
    },
    validationSchema: Yup.object({
      displayName: Yup.string()
        .min(8, "Name must be at least 8 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      username: Yup.string()
        .matches(/^[a-zA-Z0-9_.-]+$/, "Username can only contain alphanumeric characters, _, -, and .")
        .matches(/^[a-zA-Z0-9].*[a-zA-Z0-9_]$/, "Username must start with an alphanumeric character and cannot end with '.' or '-'")
        .min(8, "Username must be at least 8 characters")
        .required("Username is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      agreeToTerms: Yup.boolean()
        .oneOf([true], "You must agree to the terms and conditions"),
    }),
    onSubmit: async (values) => {
      if (!recaptchaToken) {
        setErrorMessage("Please complete the CAPTCHA");
        return;
      }
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      const { response, err } = await userApi.signup({ ...values, recaptchaToken });
      setIsLoginRequest(false);

      if (response) {
        signupForm.resetForm();
        setRecaptchaToken(null);
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
      }

      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }

      if (err) setErrorMessage(err.message);
    },
  });

  return (
    <form className="signup-form" onSubmit={signupForm.handleSubmit}>
      <div className="sign-up">
        <input
          type="text"
          placeholder="Name"
          name="displayName"
          value={signupForm.values.displayName}
          onChange={signupForm.handleChange}
          onBlur={signupForm.handleBlur}
          className="text-field"
        />
        {signupForm.touched.displayName && signupForm.errors.displayName && (
          <div className="validation-error-message">
            {signupForm.errors.displayName}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={signupForm.values.email}
          onChange={signupForm.handleChange}
          onBlur={signupForm.handleBlur}
          className="text-field"
        />
        {signupForm.touched.email && signupForm.errors.email && (
          <div className="validation-error-message">
            {signupForm.errors.email}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          name="username"
          value={signupForm.values.username}
          onChange={signupForm.handleChange}
          onBlur={signupForm.handleBlur}
          className="text-field"
        />
        {signupForm.touched.username && signupForm.errors.username && (
          <div className="validation-error-message">
            {signupForm.errors.username}
          </div>
        )}

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={signupForm.values.password}
          onChange={signupForm.handleChange}
          onBlur={signupForm.handleBlur}
          className="text-field"
        />
        {signupForm.touched.password && signupForm.errors.password && (
          <div className="validation-error-message">
            {signupForm.errors.password}
          </div>
        )}

        <div className="recaptcha">
          <ReCaptcha
            ref={recaptchaRef}
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={(token) => setRecaptchaToken(token)}
            onErrored={() => setRecaptchaToken(null)}
            theme="dark"
          />
        </div>

        <label>
          <p className="terms-and-conditions">
            By clicking "Sign Up", you are agreeing to our{" "}
            <a href="/terms-of-use" target="_blank">
              terms of use
            </a>
            &nbsp;and&nbsp;
            <a href="/privacy-policy" target="_blank">
              privacy policy
            </a>
          </p>
        </label>
        {signupForm.touched.agreeToTerms && signupForm.errors.agreeToTerms && (
          <div className="validation-error-message">
            {signupForm.errors.agreeToTerms}
          </div>
        )}
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
          Sign Up
        </button>
      </div>

      <button
        className="auth-switch"
        onClick={() => switchAuthState()}
      >
        or Sign In
      </button>
    </form>
  );
};

export default SignupForm;