import React, { useState } from "react";
import axios from "../api/axios";
import {
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  Paper,
  Tooltip,
  IconButton
} from "@mui/material";
import { FiCopy } from 'react-icons/fi'

function Profile() {
  const [format, setFormat] = useState("json");
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleExport = async () => {
    if (format === "json") {
      const res = await axios.get("/export?format=json");
      const jsonString = JSON.stringify(res.data, null, 2);
      setData(jsonString);
    } else {
      const res = await axios.get("/export?format=csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "table_export.csv");
      document.body.appendChild(link);
      link.click();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
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
          Profile / Export Data
        </Typography>
        <Select
          value={format}
          onChange={e => setFormat(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="json">JSON</MenuItem>
          <MenuItem value="csv">CSV</MenuItem>
        </Select>
        <Button variant="contained" fullWidth onClick={handleExport} sx={{ mb: 2 }}>
          Export Data
        </Button>

        {data && (
          <Box
            sx={{
              mt: 2,
              maxHeight: 300,
              overflow: "auto",
              bgcolor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              position: "relative",
            }}
          >
            <Tooltip title={copied ? "Copied!" : "Copy"}>
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <FiCopy fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" component="pre">
              {data}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Profile;
