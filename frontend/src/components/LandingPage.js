import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Fade,
} from "@mui/material";

const features = [
  {
    emoji: "🔒",
    title: "Secure Ledger",
    description: "Private, encrypted transactions that keep your data safe.",
  },
  {
    emoji: "📧",
    title: "Instant Email Alerts",
    description: "Automatic notifications sent to your borrowers instantly.",
  },
  {
    emoji: "☁️",
    title: "Cloud Backup",
    description: "Never lose your data with secure cloud backups.",
  },
  {
    emoji: "📈",
    title: "Insightful Analytics",
    description: "Visualize and track your lendings and repayments effectively.",
  },
];

const LandingPage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        userSelect: "none",
      }}
    >
      {/* Hero Section */}
      <Fade in={visible} timeout={1200}>
        <Box
          component="header"
          sx={{
            bgcolor: "primary.main",
            py: 10,
            borderRadius: "0 0 48px 48px",
            boxShadow: "inset 0 0 50px rgba(255 255 255 / 0.3)",
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={8}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                p: 6,
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(217,119,66,0.3)",
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: "primary.dark",
                  textShadow: "1px 1px 4px rgba(247,183,51,0.4)",
                }}
              >
                Lending Tracker
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, color: "primary.dark", fontWeight: 600 }}
              >
                Effortlessly manage your lendings and repayments with cloud
                backup, notifications, and insightful analytics.
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/login"
                  sx={{ px: 5, py: 1.5, fontWeight: 700, borderRadius: 5 }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={RouterLink}
                  to="/register"
                  sx={{ px: 5, py: 1.5, fontWeight: 700, borderRadius: 5 }}
                >
                  Register
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Fade>

      {/* Features Section */}
      <Box
        component="section"
        sx={{
          py: 10,
          bgcolor: "background.paper",
          textAlign: "center",
          flexGrow: 1,
          userSelect: "none",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 800, mb: 6, color: "primary.main" }}
          >
            Why Choose Lending Tracker?
          </Typography>
          <Grid container spacing={5} justifyContent="center">
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: "background.default",
                    boxShadow: "0 8px 25px rgba(247, 183, 51, 0.15)",
                    transition: "transform 0.35s ease, box-shadow 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-12px) scale(1.07)",
                      boxShadow: "0 20px 45px rgba(247, 183, 51, 0.3)",
                    },
                    cursor: "default",
                    userSelect: "none",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{ mb: 2, color: "primary.main", userSelect: "none" }}
                  >
                    {feature.emoji}
                  </Typography>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mb: 1, fontWeight: 700, color: "primary.dark" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", lineHeight: 1.5 }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "primary.light",
          color: "primary.contrastText",
          py: 3,
          textAlign: "center",
          fontWeight: 600,
          letterSpacing: 0.06,
          userSelect: "none",
          boxShadow: "0 -4px 12px rgba(247, 183, 51, 0.3)",
        }}
      >
        &copy; {new Date().getFullYear()} Lending Tracker. All rights reserved.
      </Box>
    </Box>
  );
};

export default LandingPage;
