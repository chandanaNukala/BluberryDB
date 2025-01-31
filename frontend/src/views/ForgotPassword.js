import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";


import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";


function ForgotPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
  const { sendOTP, verifyOTP, resetPassword } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(2); // 0: Login, 1: Register, 2: Forgot Password
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  const [apiErrors, setApiErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const history = useHistory();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) history.push("/login");
    if (newValue === 1) history.push("/register");
    if (newValue === 2) history.push("/forgotpassword");
  };

  const [loading, setLoading] = useState(false); // Add loading state

    const handleSendOTP = async (e) => {
      e.preventDefault();
      setApiErrors("");
      setSuccessMessage("");
      
      if (form.email.trim() === "") {
        setApiErrors("Email is required.");
        return;
      }

      setLoading(true); // Start loading
      const success = await sendOTP(form.email, "forgot_password");
      setLoading(false); // Stop loading

      if (success) {
        setStep(1);
        setSuccessMessage("OTP sent successfully to your email!");
      }
    };


  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setApiErrors("");
    setSuccessMessage("");
    if (form.otp.trim() === "") {
      setApiErrors("OTP is required.");
      return;
    }
    const otpVerified = await verifyOTP(form.email, form.otp);
    if (otpVerified) {
      setStep(2);
      setSuccessMessage("OTP Verified! You can now reset your password.");
    } else {
      setApiErrors("Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setApiErrors("");
    setSuccessMessage("");
    if (form.newPassword.trim() === "" || form.confirmPassword.trim() === "") {
      setApiErrors("Both password fields are required.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setApiErrors("Passwords do not match.");
      return;
    }
    await resetPassword(form.email, form.newPassword);
    setSuccessMessage("Password reset successful! Please login with your new password.");
    history.push("/login");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", padding: 2 }}>
      <Card sx={{ maxWidth: 450, width: "100%", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", borderRadius: 4, overflow: "hidden" }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" textColor="primary" indicatorColor="primary"
        sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#1976d2",
            },
            "& .MuiTab-root": {
              fontWeight: "bold",
              fontSize: "16px",
              padding: 1,
            },
          }}>
          <Tab label="Login" />
          <Tab label="Register" />
          <Tab label="Forgot Password" />
        </Tabs>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" textAlign="center" mb={2}>
            {step === 0 ? "Forgot Password" : step === 1 ? "Verify OTP" : "Reset Password"}
          </Typography>
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          {apiErrors && <Alert severity="error" sx={{ mb: 2 }}>{apiErrors}</Alert>}
          {step === 0 && (
            <form onSubmit={handleSendOTP}>
              <TextField fullWidth label="Enter your email" name="email" type="email" value={form.email} onChange={handleChange} margin="normal" variant="outlined" required />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={loading}>
              {loading ? "Sending OTP..." : "Get OTP to verify Email"}
            </Button>
            </form>
          )}
          {step === 1 && (
            <form onSubmit={handleVerifyOTP}>
              <TextField fullWidth label="Enter OTP" name="otp" type="text" value={form.otp} onChange={handleChange} margin="normal" variant="outlined" required />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Verify OTP</Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <TextField
                fullWidth
                label="Enter new Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={form.newPassword}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Verify new password"
                name="confirmPassword"
                type={showPassword2 ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Reset Password</Button>

            </form>
          )}
        </CardContent>
      </Card>
      {/* Footer Section */}
      <Box
        component="footer"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#1976d2",
          color: "white",
          textAlign: "center",
          py: 1.5,
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Blueberry. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default ForgotPasswordPage;