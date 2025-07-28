import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Box, Button, List, ListItem, ListItemText, Paper, Chip, Divider, TextField, Snackbar, Alert, Stack } from "@mui/material";

function BorrowerDetail() {
  const { id } = useParams();
  const [borrower, setBorrower] = useState(null);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBorrower();
  }, [id]);

  const fetchBorrower = () => {
    axios.get(`/borrowers/${id}`)
      .then(res => setBorrower(res.data))
      .catch(() => setBorrower(null));
  };

 const handleBackupDownload = () => {
  axios.get(`/backup/download`, {
    responseType: 'blob',  // 👈 Important: treat response as binary
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Google_backup.xlsx'); // Or use dynamic name
        document.body.appendChild(link);
        link.click();
        link.remove();

        showSnackbar("Backup downloaded successfully.");
      })
      .catch(() => {
        showSnackbar("Failed to download backup.", "error");
      });
    };


  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const validateEmail = (email) => /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);

  const updateEmail = () => {
    if (!validateEmail(newEmail)) {
      return showSnackbar("Please enter a valid email.", "error");
    }
    axios.put(`/borrowers/${id}`, { email: newEmail })
      .then(() => {
        showSnackbar("Email updated successfully.");
        setEditingEmail(false);
        fetchBorrower();
      });
  };

  const updateName = () => {
    if (!newName.trim()) {
      return showSnackbar("Name cannot be empty.", "error");
    }
    axios.put(`/borrowers/${id}`, { name: newName })
      .then(() => {
        showSnackbar("Name updated successfully.");
        setEditingName(false);
        fetchBorrower();
      });
  };

  const markAsFullyPaid = () => {
    if (borrower.outstanding !== 0) {
      showSnackbar("Outstanding amount must be zero to mark as fully paid.", "error");
      return;
    }
    axios.post(`/borrowers/${id}/mark_paid`).then(() => {
      showSnackbar("Marked as fully paid.");
      fetchBorrower();
    });
  };

  if (!borrower) return (
    <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Typography>Loading...</Typography>
    </Box>
  );

  const sortedLendings = [...borrower.lendings].sort((a, b) => new Date(b.date) - new Date(a.date));
  const sortedRepayments = [...borrower.repayments].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default", px: 2 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, width: { xs: "100%", sm: 500 }, maxWidth: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          {borrower.name}
        </Typography>

        {editingName ? (
          <Box sx={{ mt: 1, mb: 2 }}>
            <TextField
              label="New Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              fullWidth
              size="small"
            />
            <Button variant="contained" color="primary" sx={{ mt: 1, mr: 1 }} onClick={updateName}>Update</Button>
            <Button variant="outlined" onClick={() => setEditingName(false)}>Cancel</Button>
          </Box>
        ) : (
          <Button variant="outlined" sx={{ mb: 2 }} onClick={() => {setNewName(borrower.name); setEditingName(true);}}>
            Edit Name
          </Button>
        )}

        <Typography align="center" sx={{ mb: 1 }}>
          <Chip label={borrower.fully_paid ? "Fully Paid" : "Outstanding"} color={borrower.fully_paid ? "success" : "warning"} />
        </Typography>

        <Typography>Email: {borrower.email || "N/A"}</Typography>

        {editingEmail ? (
          <Box sx={{ mt: 1, mb: 2 }}>
            <TextField
              label="New Email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              fullWidth
              size="small"
            />
            <Button variant="contained" color="primary" sx={{ mt: 1, mr: 1 }} onClick={updateEmail}>Update</Button>
            <Button variant="outlined" onClick={() => setEditingEmail(false)}>Cancel</Button>
          </Box>
        ) : (
          <Button variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={() => {setNewEmail(borrower.email || ""); setEditingEmail(true);}}>
            Edit Email
          </Button>
        )}

        <Typography>Outstanding: <b>{borrower.outstanding}</b></Typography>


        <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate("/add-repayment")}
            disabled={borrower.outstanding === 0}
          >
            Add Repayment
          </Button>

          <Button
            variant="outlined"
            color="success"
            fullWidth
            onClick={markAsFullyPaid}
            disabled={borrower.outstanding !== 0}
          >
            Mark as Fully Paid
          </Button>

          <Button
              variant="outlined"
              color="info"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleBackupDownload}
            >
              Download Backup
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>Lendings</Typography>
        <List>
          {sortedLendings.length === 0 && (
            <ListItem>
              <ListItemText primary="No lendings yet." />
            </ListItem>
          )}
          {sortedLendings.map(l => (
            <ListItem key={l.id} sx={{ bgcolor: "#f5f5f5", mb: 1, borderRadius: 1 }}>
              <ListItemText
                primary={`Amount: ${l.amount}`}
                secondary={`Date: ${new Date(l.date).toLocaleString()} | Note: ${l.note || "None"}`}
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Repayments</Typography>
        <List>
          {sortedRepayments.length === 0 && (
            <ListItem>
              <ListItemText primary="No repayments yet." />
            </ListItem>
          )}
          {sortedRepayments.map(r => (
            <ListItem key={r.id} sx={{ bgcolor: "#e3f2fd", mb: 1, borderRadius: 1 }}>
              <ListItemText
                primary={`Amount: ${r.amount}`}
                secondary={`Date: ${new Date(r.date).toLocaleString()} | Note: ${r.note || "None"}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BorrowerDetail;
