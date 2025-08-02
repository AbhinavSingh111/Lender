import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { filterOutstandingBorrowers } from '../utils/borrowerUtils';
import { List, ListItem, ListItemText, Button, Typography, Box, Paper, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

function BorrowerList() {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);  // NEW
  const navigate = useNavigate();
  const outstandingBorrowers = filterOutstandingBorrowers(borrowers);
  useEffect(() => {
    axios.get("/borrowers")
      .then(res => setBorrowers(res.data))
      .catch(() => setBorrowers([]))
      .finally(() => setLoading(false));  // stop loading
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          width: { xs: "100%", sm: 500 },
          maxWidth: "100%",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Borrowers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => navigate("/add-lending")}
        >
          Add Lending
        </Button>
        <List>
          {loading ? (
            <ListItem>
              <ListItemText primary="Take a deep breath, we are getting it for you..." />
            </ListItem>
          ) : outstandingBorrowers.length === 0 ? (
            <ListItem>
              <ListItemText primary="No borrowers found." />
            </ListItem>
          ) : (
            outstandingBorrowers.map(b => (
              <ListItem
                key={b.id}
                sx={{
                  bgcolor: "#f5f5f5",
                  mb: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#e3f2fd" }
                }}
                onClick={() => navigate(`/borrower/${b.id}`)}
              >
                <ListItemText
                  primary={b.name}
                  secondary={b.email || "No email"}
                />
                {b.fully_paid ? (
                  <Chip label="Paid" color="success" size="small" sx={{ ml: 2 }} />
                ) : (
                  <Chip label={b.outstanding} color="error" size="small" sx={{ ml: 2 }} />
                )}
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default BorrowerList;