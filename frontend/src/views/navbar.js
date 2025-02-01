import * as React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Button,
  Typography,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {  useHistory } from "react-router-dom"; // Import useHistory
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from "@mui/icons-material/Info";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LogoutIcon from "@mui/icons-material/Logout";
import Tooltip from "@mui/material/Tooltip";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function Navbar() {
  const history = useHistory(); // Use useHistory for navigation
  const { logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");
  // let user_id = null;
  let username = "";

  if (token) {
    const decoded = jwtDecode(token);
    // user_id = decoded.user_id;
    username = decoded.username;
  }

  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  // Handle navigation with login check
  const handleNavigation = (link) => {
    if (link === "/database" && !token) {
      Swal.fire({
        icon: "warning",
        title: "Access Denied",
        text: "You must be logged in to view this page!",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/login"); // Redirect to login page after clicking OK
        }
      });
      return; // Stop navigation
    }
    history.push(link); // Navigate using history
  };

  const navItems = [
    { text: "About", icon: <InfoIcon />, link: "/about" },
    { text: "Database", icon: <AddBoxIcon />, link: "/database" },
    { text: "Contact", icon: <AddBoxIcon />, link: "/contact" },
  ];

  const navbarHeight =
    open && isMobile
      ? `${navItems.length * 50 + (token ? 80 : 50) + 64}px`
      : "64px";

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          transition: "height 0.3s ease",
          height: navbarHeight,
          width: "100%",
          backgroundColor: "primary.main",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <a href="/">
              <img
                src="https://static.wixstatic.com/media/b1af78_3dc8c8ffba6c4335852fbd2d48428adf~mv2_d_13258_3944_s_3_2.png/v1/fit/w_2500,h_1330,al_c/b1af78_3dc8c8ffba6c4335852fbd2d48428adf~mv2_d_13258_3944_s_3_2.png"
                alt="Blueberry Breeding Lab"
                style={{ height: "40px", width: "auto", cursor: "pointer" }}
              />
            </a>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile ? (
            <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "left" }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={() => handleNavigation(item.link)}
                  sx={{ color: "white", mx: 2 }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          ) : (
            <IconButton color="inherit" edge="end" onClick={() => setOpen(!open)}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Authentication Buttons */}
          {!isMobile && token ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Tooltip title="Click to Logout" arrow>
                <Button variant="outlined" color="inherit" onClick={logoutUser} sx={{ borderColor: "white", color: "white" }}>
                  <Typography variant="body1" sx={{ color: "white", mr: 1 }}>
                    {username}
                  </Typography>
                  <LogoutIcon />
                </Button>
              </Tooltip>
            </Stack>
          ) : !isMobile && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => history.push("/login")}
              startIcon={<LogoutIcon />}
              sx={{
                borderRadius: "50px",
                px: 3,
                py: 1,
                fontWeight: "bold",
                border: "2px solid white",
                color: "white",
                transition: "0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: "scale(1.05)",
                },
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>

        {/* Mobile Navigation */}
        {isMobile && open && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
              pl: 2,
              pb: 2,
              backgroundColor: "primary.main",
              position: "absolute",
              top: "64px",
              left: 0,
              right: 0,
              zIndex: 1100,
            }}
          >
            <List sx={{ width: "100%" }}>
              {navItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton onClick={() => handleNavigation(item.link)}>
                    <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} sx={{ color: "white" }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {/* Mobile Authentication Buttons */}
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start", mt: 2, pl: 2 }}>
              {token ? (
                <Tooltip title="Click to Logout" arrow>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={logoutUser}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      width: "auto",
                    }}
                  >
                    <Typography variant="body1" sx={{ color: "white", mr: 1 }}>{username}</Typography>
                    <LogoutIcon />
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => history.push("/login")}
                  startIcon={<LogoutIcon />}
                  sx={{
                    borderRadius: "50px",
                    px: 3,
                    py: 1,
                    fontWeight: "bold",
                    border: "2px solid white",
                    color: "white",
                    transition: "0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>
        )}
      </AppBar>

      <Box sx={{ mt: navbarHeight, transition: "margin-top 0.3s ease" }} />
    </Box>
  );
}
