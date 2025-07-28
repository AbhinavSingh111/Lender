import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography, MenuItem, Select, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

function LendingForm() {
  const [borrowers, setBorrowers] = useState([]);
  const [borrowerId, setBorrowerId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [msg, setMsg] = useState("");

  // For Add Borrower dialog
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [addMsg, setAddMsg] = useState("");

  useEffect(() => {
    axios.get("/borrowers").then(res => setBorrowers(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/lendings", { borrower_id: borrowerId, amount, note, send_email: sendEmail });
      setMsg("Lending recorded!");
      setBorrowerId("");
      setAmount("");
      setNote("");
      setSendEmail(false);
    } catch {
      setMsg("Failed to record lending.");
    }
  };

  const handleAddBorrower = async () => {
    if (!newName) {
      setAddMsg("Name is required.");
      return;
    }
    try {
      const res = await axios.post("/borrowers", { name: newName, email: newEmail });
      setAddMsg("Borrower added!");
      setBorrowers(prev => [...prev, { id: res.data.id, name: newName, email: newEmail, fully_paid: false }]);
      setBorrowerId(res.data.id);
      setOpen(false);
      setNewName("");
      setNewEmail("");
      setAddMsg("");
    } catch {
      setAddMsg("Failed to add borrower.");
    }
  };

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
          width: { xs: "100%", sm: 400 },
          maxWidth: "100%",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Add Lending
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mb: 2 }}
          onClick={() => setOpen(true)}
        >
          + Add New Borrower
        </Button>
        <form onSubmit={handleSubmit}>
          <Select
            fullWidth
            value={borrowerId}
            onChange={e => setBorrowerId(e.target.value)}
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>Select Borrower</MenuItem>
            {borrowers.map(b => (
              <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
            ))}
          </Select>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <TextField
            label="Note"
            fullWidth
            margin="normal"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} />}
            label="Send Email Notification"
            sx={{ mt: 1 }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Add Lending
          </Button>
          <Typography color="success.main" sx={{ mt: 2, textAlign: "center" }}>{msg}</Typography>
        </form>
      </Paper>

      {/* Add Borrower Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Borrower</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <TextField
            label="Email (optional)"
            fullWidth
            margin="normal"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />
          <Typography color="error" sx={{ mt: 1 }}>{addMsg}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddBorrower}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LendingForm;