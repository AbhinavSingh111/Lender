import React, { useState } from "react";
import axios from "../api/axios";
import { TextField, Button, Typography, Box, Paper, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/register", { email, password });
      setMsg("Registration successful! Please login.");
      window.location.href = "/login";
    } catch (err) {
      setMsg("Registration failed");
    }
  };

  const handleGoogleRegister = () => {
      window.location.href = "http://127.0.0.1:5000/auth/google/login";

  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default", px: 2 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, width: { xs: "100%", sm: 350 }, maxWidth: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>Register</Typography>

        <form onSubmit={handleSubmit}>
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
          <Typography color="error" sx={{ mt: 2 }}>{msg}</Typography>
        </form>

        <Divider sx={{ my: 2 }}>or</Divider>

        <Button onClick={handleGoogleRegister} startIcon={<FcGoogle size={24} /> }variant="outlined" color="secondary" fullWidth>
          Register with Google
        </Button>

        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Already have an account? <Link to="/login">Login here</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
