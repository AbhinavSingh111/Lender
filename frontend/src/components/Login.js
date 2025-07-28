// import React, { useState } from "react";
// import axios from "../api/axios";
// import { Link } from "react-router-dom";
// import { TextField, Button, Typography, Box, Paper } from "@mui/material";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("/login", { email, password });
//       localStorage.setItem("token", res.data.access_token);
//       setMsg("Login successful!");
//       window.location.href = "/";
//     } catch (err) {
//       setMsg("Login failed");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         bgcolor: "background.default",
//         px: 2,
//       }}
//     >
//       <Paper
//         elevation={3}
//         sx={{
//           p: { xs: 2, sm: 4 },
//           width: { xs: "100%", sm: 350 },
//           maxWidth: "100%",
//         }}
//       >
//         <Typography variant="h5" align="center" gutterBottom>
//           Login
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Email"
//             fullWidth
//             margin="normal"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             autoComplete="email"
//           />
//           <TextField
//             label="Password"
//             type="password"
//             fullWidth
//             margin="normal"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             autoComplete="current-password"
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ mt: 2 }}
//           >
//             Login
//           </Button>
//           <Typography color="error" sx={{ mt: 2 }}>
//             {msg}
//           </Typography>
//         </form>
//         <Typography sx={{ mt: 2, textAlign: "center" }}>
//           Don't have an account? <Link to="/register">Register here</Link>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// }

// export default Login;

import React, { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { TextField, Button, Typography, Box, Paper, Divider } from "@mui/material";
import { FcGoogle } from 'react-icons/fc';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      setMsg("Login successful!");
      window.location.href = "/";
    } catch (err) {
      setMsg("Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/auth/google/login";
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default", px: 2 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, width: { xs: "100%", sm: 350 }, maxWidth: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>Login</Typography>

        <form onSubmit={handleSubmit}>
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
          <Typography color="error" sx={{ mt: 2 }}>{msg}</Typography>
        </form>

        <Divider sx={{ my: 2 }}>or</Divider>

        <Button onClick={handleGoogleLogin} startIcon={<FcGoogle size={24} />} variant="outlined" color="secondary" fullWidth>
          Sign in with Google
        </Button>

        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
