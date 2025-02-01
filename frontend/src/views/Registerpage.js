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
} from "@mui/material";

function RegisterPage() {
  const {registerUser } = useContext(AuthContext);
  const history = useHistory();

  const [activeTab, setActiveTab] = useState(1);
  const [form, setForm] = useState({
    email: "",
    confirmEmail: "",
    username: "",
  });
  
  const [apiErrors, setApiErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) history.push("/login");
    else if (newValue === 2) history.push("/resetpassword");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setApiErrors("");
    setSuccessMessage("");

    if (form.email.trim() === "" || form.confirmEmail.trim() === "" || form.username.trim() === "") {
        setApiErrors("All fields are required.");
        return;
    }

    if (form.email !== form.confirmEmail) {
        setApiErrors("Emails do not match.");
        return;
    }

    setLoading(true);
    try {
        const data = await registerUser(form.email, form.username);
        if (data) {
          setSuccessMessage(`Thank you, ${form.email}, for applying for an account. Your registration is currently under review by the site administrator. You will receive an email with further instructions once your account is approved.`);
        }
    } catch (error) {
        setApiErrors(error.message);
    }
    setLoading(false);
};

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", padding: 2 }}>
      <Card sx={{ maxWidth: 450, width: "100%", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", borderRadius: 4, overflow: "hidden" }}>
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
            Register
          </Typography>

          {successMessage && (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button variant="contained" onClick={() => history.push("/login")}>
                  Go to Login
                </Button>
                <Button variant="outlined" onClick={() => history.push("/")}>
                  Go to Home
                </Button>
              </Box>
            </>
          )}
          {apiErrors && <Alert severity="error" sx={{ mb: 2 }}>{apiErrors}</Alert>}

          {!successMessage && (
            <form onSubmit={handleRegister}>
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
                label="Confirm Email"
                name="confirmEmail"
                type="email"
                value={form.confirmEmail}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#145ca4" } }}
                disabled={loading}
              >
                {loading ? "Processing..." : "Register"}
              </Button>
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

export default RegisterPage;
