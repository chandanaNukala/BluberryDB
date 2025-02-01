import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom"; // React Router v5
import { Box, Typography,Card, CardContent } from "@mui/material";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";

const Database = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      Swal.fire({
        title: "Access Denied",
        text: "You must be logged in to view the database!",
        icon: "warning",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setTimeout(() => {
        history.push("/login");
      }, 2000);
    }
  }, [user, history]);

  if (!user) return null;

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 500, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome to the Database Page
          </Typography>
          <Typography variant="body1">
            This is a private page that only logged-in users can view.
          </Typography>
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
          © {new Date().getFullYear()} Blueberry. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Database;
