import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  LinearProgress,
  Typography,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const UploadModal = ({ onUploadSuccess }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setMessage("");
    setFile(null);
  };

  const handleClose = () => {
    if (!uploading) setOpen(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Seleziona un file prima di caricare.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:4000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message);
      onUploadSuccess(); // aggiorna lista versioni
      setTimeout(() => {
        setUploading(false);
        setOpen(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage("Errore durante l'upload.");
      setUploading(false);
    }
  };

  return (
    <>
      <Tooltip title="Carica nuova versione">
        <IconButton
          onClick={handleOpen}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          <CloudUploadIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Carica una nuova versione di Zuabam</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <input type="file" onChange={handleFileChange} accept="*" />
            {uploading && <LinearProgress />}
            {message && (
              <Typography variant="body2" color="text.secondary">
                {message}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={uploading}>
            Annulla
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Caricamento..." : "Carica"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadModal;
