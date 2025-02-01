import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom"; // Import useHistory
import AuthContext from "../context/AuthContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  Tabs,
  IconButton,
  Tab,
  Container
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0); // 0: Login, 1: Register, 2: Forgot Password
  const [form, setForm] = useState({ email: "", password: "" });
  const history = useHistory(); // Use useHistory for navigation

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);

    // Navigate to appropriate page when Register or Forgot Password is clicked
    if (newValue === 1) {
      history.push("/register"); // Navigate to the Register page
    } else if (newValue === 2) {
      history.push("/resetpassword"); // Navigate to the Reset Password page
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 0) {
      // Login
      const email = form.email;
      const password = form.password;
      if (email && password) loginUser(email, password);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh", // Ensures full height
      
        paddingBottom: 6, // Prevent content from overlapping footer
      }}
    >
      <Container maxWidth="sm"> {/* Ensures responsiveness */}
        <Card
          sx={{
            maxWidth: 450,
            width: "100%",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            borderRadius: 4,
            overflow: "hidden",
            margin: "auto", // Ensures center alignment
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
            <Tab label="Reset Password" />
          </Tabs>
          <CardContent sx={{ padding: 3 }}>
            {activeTab === 0 && (
              <form onSubmit={handleSubmit}>
                <Typography variant="h5" textAlign="center" mb={2}>
                  Login
                </Typography>
                <TextField
                  fullWidth
                  label="Email or Username"
                  name="email"
                  type="text"
                  value={form.email}
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#145ca4" },
                  }}
                >
                  Login
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>

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
                  © {new Date().getFullYear()} Blueberry Genome Database. All Rights Reserved.
                </Typography>
                <Typography variant="body2">
                  Powered by the Blueberry Breeding & Genomics Lab.
                </Typography>
      </Box>
    </Box>
  );
}

export default LoginPage;
