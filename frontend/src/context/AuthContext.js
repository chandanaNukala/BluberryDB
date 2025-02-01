import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
const swal = require("sweetalert2");

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );

  const [loading, setLoading] = useState(true);

  const history = useHistory();

  // Login User
  const loginUser = async (email, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      history.push("/");
      swal.fire({
        title: "Login Successful",
        icon: "success",
        toast: true,
        timer: 2000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,  // Adds the "X" button to close the alert
      });

    } else {
      swal.fire({
        title: "Invalid Credentials",
        icon: "error",
        toast: true,
        timer: 2000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton:true
      });
    }
  };

  // Register User

  const registerUser = async (email, username) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Registration failed.");
        }

        swal.fire({
            title: "Success",
            text: data.message,
            icon: "success",
            toast: true,
            timer: 2000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
            showCloseButton: true
        });

        return true;
    } catch (error) {
        swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            toast: true,
            timer: 2000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
            showCloseButton: true
        });
        return false;
    }
};

  // Send OTP
  const sendOTP = async (email,parmtext) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email ,parmtext}),
      });

      const data = await response.json();
      if (response.ok) {
        swal.fire({
          title: "OTP Sent",
          text: "An OTP has been sent to your email.",
          icon: "success",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
          showCloseButton:true
        });
        return true;
      } else {
        throw new Error(data.error || "Failed to send OTP.");
      }
    } catch (error) {
      swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        toast: true,
        timer: 2000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton:true
      });
      return false;
    }
  };

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
  
      const data = await response.json();
      console.log("OTP Verification Response:", data); // Debugging log
      if (response.ok) {
        swal.fire({
          title: "OTP Verified",
          icon: "success",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
          showCloseButton:true
        });
        return true;
      } else {
        throw new Error(data.error || "Invalid OTP.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error.message);
      swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        toast: true,
        timer: 2000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton:true
      });
      return false;
    }
  };
  // Reset Password
const resetPassword = async (email, newPassword) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/reset-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, new_password: newPassword }),
    });

    const data = await response.json();
    if (response.ok) {
      swal.fire({
        title: "Password Reset Successful",
        text: "You can now login with your new password.",
        icon: "success",
        toast: true,
        timer: 2000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton:true
      });
      return true;
    } else {
      throw new Error(data.error || "Failed to reset password.");
    }
  } catch (error) {
    swal.fire({
      title: "Error",
      text: error.message,
      icon: "error",
      toast: true,
      timer: 2000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton:true
    });
    return false;
  }
};
const verifyOldPassword = async (email, oldPassword) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/verify-old-password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, oldPassword }),
    });

    if (!response.ok) {
      throw new Error("Invalid email or old password");
    }

    return true;
  } catch (error) {
    console.error("Error verifying old password:", error);
    return false;
  }
};

  // Logout User
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    history.push("/login");
    swal.fire({
      title: "Logged Out",
      icon: "success",
      toast: true,
      timer: 2000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton:true
    });
  };
  const isTokenExpired = () => {
    if (!authTokens) return true; // No token means expired
    const decoded = jwtDecode(authTokens.access);
    return decoded.exp < Date.now() / 1000; // Compare expiry with current time
  };

  // Run Check on Component Load
  useEffect(() => {
    if (authTokens) {
      if (isTokenExpired()) {
        logoutUser();
      } else {
        setUser(jwtDecode(authTokens.access));
      }
    }
  }, [authTokens]);


  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
    sendOTP,
    verifyOTP,
    resetPassword,
    verifyOldPassword,

  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};
