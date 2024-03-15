import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setUser } from "../../redux/features/userSlice";
import userApi from "../../api/modules/usersApi";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import "./passwordupdate.css"

const PasswordUpdate = () => {
  const [onRequest, setOnRequest] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "* Password minimum 8 characters")
        .required("* Password is required"),
      newPassword: Yup.string()
        .min(8, "* New Password minimum 8 characters")
        .required("* New Password is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "* Confirm new password not match")
        .min(8, "* Confirm new password minimum 8 characters")
        .required("* Confirm new password is required")
    }),
    onSubmit: async values => onUpdate(values)
  });

  const onUpdate = async (values) => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, err } = await userApi.passwordUpdate(values);

    setOnRequest(false);

    if (err) console.log(err);
    if (response) {
      form.resetForm();
      navigate("/");
      dispatch(setUser(null));
      dispatch(setAuthModalOpen(true));
    }
  };

  return (
    <form className="password-update-form" onSubmit={form.handleSubmit}>
      <div className="old-password">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.values.password}
          onChange={form.handleChange}
        />
        {form.touched.password && form.errors.password && (
          <div className="error-message">{form.errors.password}</div>
        )}
      </div>
      <div className="new-password">
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={form.values.newPassword}
          onChange={form.handleChange}
        />
        {form.touched.newPassword && form.errors.newPassword && (
          <div className="error-message">{form.errors.newPassword}</div>
        )}
      </div>
      <div className="confirm-password">
        <label htmlFor="confirmNewPassword">Confirm New Password</label>
        <input
          type="password"
          id="confirmNewPassword"
          name="confirmNewPassword"
          value={form.values.confirmNewPassword}
          onChange={form.handleChange}
        />
        {form.touched.confirmNewPassword && form.errors.confirmNewPassword && (
          <div className="error-message">{form.errors.confirmNewPassword}</div>
        )}
      </div>

      <button type="submit" disabled={onRequest}>
        Update Password
      </button>
    </form>
  );
};

export default PasswordUpdate;