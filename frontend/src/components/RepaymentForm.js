import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography, MenuItem, Select, Paper,  Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

function RepaymentForm() {
  const [borrowers, setBorrowers] = useState([]);
  const [borrowerId, setBorrowerId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get("/borrowers").then(res => setBorrowers(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/repayments", { borrower_id: borrowerId, amount, note, send_email: sendEmail });
      setMsg("Repayment recorded!");
      setBorrowerId("");
      setAmount("");
      setNote("");
      setSendEmail(false);
    } catch {
      setMsg("Failed to record repayment.");
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
          Add Repayment
        </Typography>
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
            Add Repayment
          </Button>
          <Typography color="success.main" sx={{ mt: 2, textAlign: "center" }}>{msg}</Typography>
        </form>
      </Paper>
    </Box>
  );
}

export default RepaymentForm;