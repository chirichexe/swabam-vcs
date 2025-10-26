import React, { useState, useRef } from "react";
import axios from "axios";
import "./UploadPage.css";

const UploadPage = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const dropRef = useRef();

  const handleFileSelect = (f) => {
    setFile(f);
    setMessage("");
    setProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.classList.add("hover");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.classList.remove("hover");
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
      setMessage("");
      const res = await axios.post(`/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });

      setMessage(res.data.message);
      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => {
        setUploading(false);
        setFile(null);
        setProgress(0);
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage("Errore durante l'upload.");
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="upload-page">
      <h2 className="upload-title">Carica nuova versione di Swabam</h2>

      <div
        className="dropzone"
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <p>Trascina il file qui o clicca per selezionarlo</p>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />
      </div>

      {file && <div className="selected-file">{file.name}</div>}

      {uploading && (
        <div className="upload-progress">
          <div
            className="upload-progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {message && <div className="upload-message">{message}</div>}

      <div className="upload-buttons">
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading || !file}
        >
          {uploading ? "Caricamento..." : "Carica"}
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
