import React from "react";
import { Box, Button, Card, CardContent, Container, CssBaseline, Grid, Typography } from "@mui/material";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useHistory } from "react-router-dom"; 
function HomePage() {
  const history = useHistory();
  const token = localStorage.getItem("authTokens");

  const checkAuthAndNavigate = () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Access Denied",
        text: "You must be logged in to view this page!",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/login");
        }
      });
      return;
    }
    history.push("/database");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "95vh" }}>
      <CssBaseline />

      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "#e3f2fd",
          padding: "100px 20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Blueberry Genome Database
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 700 }}>
          Empowering researchers and breeders with cutting-edge genomic insights
          into blueberry species to drive innovation in agriculture and health sciences.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3, bgcolor: "#1976d2", color: "white" }}
          onClick={checkAuthAndNavigate} // Call authentication check
        >
          Explore the Database
        </Button>
      </Box>

      {/* Main Content Area (Expands) */}
      <Box sx={{ flexGrow: 1 }}>
        <Container sx={{ mt: 5 }}>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                title: "About the Project",
                desc: "Discover the mission behind our genome research and its impact on the industry.",
                link: "/about",
              },
              {
                title: "Genome Database",
                desc: "Access genomic sequences, trait analysis, and research data for blueberries.",
                link: "/database",
              },
              {
                title: "Contact Our Team",
                desc: "Have questions? Get in touch with our team of researchers and experts.",
                link: "/contact",
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {feature.desc}
                    </Typography>
                    <Button variant="outlined" href={feature.link}>
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer Always at Bottom */}
      <Box
        component="footer"
        sx={{
          textAlign: "center",
          padding: 3,
          bgcolor: "#1976d2",
          color: "white",
          width: "100%",
          flexShrink: 0,
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

export default HomePage;
