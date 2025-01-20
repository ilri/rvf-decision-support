import React, { useState } from "react";
import { Button, Spinner } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { EmailId, TemporaryPassword } from "../../Constants";
import { showError } from "../../components/Common/Notifications";

function Login() {
  const [isPassword, setIsPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const path = urlParams.get("path");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const handleLogin = (loginData) => {
    setLoader(true);
    setTimeout(() => {
      if (loginData?.email === EmailId && TemporaryPassword === loginData?.password) {
        setLoader(false);
        localStorage.setItem(
          "userDetails",
          JSON.stringify({
            email: EmailId,
            password: TemporaryPassword,
          })
        );
        navigate(path ? path : "/home");
      } else {
        setLoader(false);
        showError("You have entered an incorrect Email/Password, please try again.");
      }
    }, 1000);
  };
  return (
    <div className="login-container login-container-alignment">
      <form onSubmit={handleSubmit(handleLogin)} className="login-card ">
        <p className="loginText"> Welcome ! </p>
        <div className={` mb-4 login-field-alignment ${errors.email ? "has-error" : ""}`}>
          <span className="label-text form-label">Email</span>
          <input
            type="text"
            placeholder="Please Enter your Email *"
            className={`email-field ${errors.email ? "input-error" : ""}`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />

          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>
        <div className={` mb-4 login-field-alignment ${errors.password ? "has-error" : ""}`}>
          <span className="label-text form-label">Password</span>
          <div className="eye-position-relative">
            <input
              type={!isPassword ? "password" : "text"}
              id={"password"}
              className={`email-field ${errors.password ? "input-error" : ""}`}
              placeholder="Please Enter your Password *"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />

            {isPassword ? (
              <IoMdEyeOff className="eye-icon-position" onClick={() => setIsPassword(false)} />
            ) : (
              <IoEye className="eye-icon-position" onClick={() => setIsPassword(true)} />
            )}
          </div>
          {errors.password && <span className="error-message">{errors.password?.message}</span>}
        </div>
        <div className="submit-btn-container mt-5 mb-2">
          <Button className="submit-btn-login" type="submit" disabled={!isValid}>
            {loader ? (
              <div>
                <Spinner size="sm" /> <span> Login</span>
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;
