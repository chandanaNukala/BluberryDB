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
  const [showPassword0, setShowPassword0] = useState(false);
  const { verifyOldPassword, resetPassword } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(2);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ email: "", oldPassword: "", newPassword: "", confirmPassword: "" });
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
    if (newValue === 2) history.push("/resetpassword");
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleVerifyOldPassword = async (e) => {
    e.preventDefault();
    setApiErrors("");
    setSuccessMessage("");
    if (form.email.trim() === "" || form.oldPassword.trim() === "") {
      setApiErrors("Email and old password are required.");
      return;
    }
    const verified = await verifyOldPassword(form.email, form.oldPassword);
    if (verified) {
      setStep(1);
      setSuccessMessage("Old password verified! You can now reset your password.");
    } else {
      setApiErrors("Invalid email or old password. Please try again.");
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
    if (!validatePassword(form.newPassword)) {
      setApiErrors("Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.");
      return;
    }
    await resetPassword(form.email, form.newPassword);
    setSuccessMessage("Password reset successful! Please login with your new password.");
    history.push("/login");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", padding: 2 }}>
      <Card sx={{ maxWidth: 450, width: "100%", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", borderRadius: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ "& .MuiTabs-indicator": { backgroundColor: "#1976d2" }, "& .MuiTab-root": { fontWeight: "bold", fontSize: "16px", padding: 1 } }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
          <Tab label="Reset Password" />
        </Tabs>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" textAlign="center" mb={2}>
            {step === 0 ? "Verify Old Password" : "Reset Password"}
          </Typography>
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          {apiErrors && <Alert severity="error" sx={{ mb: 2 }}>{apiErrors}</Alert>}
          {step === 0 && (
            <form onSubmit={handleVerifyOldPassword}>
              <TextField fullWidth label="Enter your email" name="email" type="email" value={form.email} onChange={handleChange} margin="normal" variant="outlined" required />
              <TextField fullWidth label="Enter old password" name="oldPassword"  type={showPassword0 ? "text" : "password"} value={form.oldPassword} onChange={handleChange} margin="normal" variant="outlined" required 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword0(!showPassword0)}>
                      {showPassword0 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}/>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Verify Old Password</Button>
            </form>
          )}
          {step === 1 && (
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
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirm new password"
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
                      <IconButton onClick={() => setShowPassword2(!showPassword2)}>
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
                        © {new Date().getFullYear()} Blueberry Genome Database. All Rights Reserved.
                      </Typography>
                      <Typography variant="body2">
                        Powered by the Blueberry Breeding & Genomics Lab.
                      </Typography>
            </Box>
    </Box>
  );
}

export default ForgotPasswordPage;