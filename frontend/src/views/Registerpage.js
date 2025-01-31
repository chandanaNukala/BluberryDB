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
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function RegisterPage() {
  const { sendOTP, verifyOTP, registerUser } = useContext(AuthContext);
  const history = useHistory();

  const [activeTab, setActiveTab] = useState(1); // 0: Login, 1: Register, 2: Forgot Password
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    otp: "",
  });

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [apiErrors, setApiErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) history.push("/login");
    else if (newValue === 2) history.push("/forgotpassword");
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
    const success = await sendOTP(form.email, "register_password");
    setLoading(false); // Stop loading

    if (success) {
      setStep(2);
      setSuccessMessage("OTP sent successfully to your email!");
    }
  };


  const handleVerifyOTPAndRegister = async (e) => {
    e.preventDefault();
    setApiErrors("");
    setSuccessMessage("");

    if (form.otp.trim() === "" || form.password !== form.password2) {
      setApiErrors("Invalid OTP or passwords do not match.");
      return;
    }

    const otpVerified = await verifyOTP(form.email, form.otp);
    if (otpVerified) {
      await registerUser(form.email, form.username, form.password, form.password2, form.otp);
    } else {
      setApiErrors("OTP verification failed.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
      
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#1976d2" },
            "& .MuiTab-root": { fontWeight: "bold", fontSize: "16px", padding: 1 },
          }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
          <Tab label="Forgot Password" />
        </Tabs>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" textAlign="center" mb={2}>
            {step === 1 ? "Register" : "Verify OTP"}
          </Typography>

          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          {apiErrors && <Alert severity="error" sx={{ mb: 2 }}>{apiErrors}</Alert>}

          {step === 1 ? (
            <form onSubmit={handleSendOTP}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
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
                label="Confirm Password"
                name="password2"
                type={showPassword2 ? "text" : "password"}
                value={form.password2}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#145ca4" } }}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Get OTP to Verify Email"}
              </Button>

            </form>
          ) : (
            <form onSubmit={handleVerifyOTPAndRegister}>
              <TextField
                fullWidth
                label="Enter OTP"
                name="otp"
                type="text"
                value={form.otp}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#145ca4" } }}
              >
                Verify & Register
              </Button>
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

export default RegisterPage;
