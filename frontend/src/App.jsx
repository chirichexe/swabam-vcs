import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Container, CircularProgress, Button } from "@mui/material";
import VersionList from "./components/VersionList";
import UploadPage from "./components/UploadPage";
import axios from "axios";
import "./App.css";

function Dashboard({ versions, loading }) {
  return (
    <Container 
      className="container-videogame"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        py: 4
      }}
    >
      <img src="/logo.png" alt="Swabam Logo" className="logo-videogame" />
      <h1 className="title-videogame">Benvenuto in via del Pratello 48!</h1>
      <p className="subtitle-videogame">
        Scegli una versione da scaricare e inizia a giocare a Swabam
      </p>

      <hr className="divider-videogame" />

      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <div className="version-list">
          <VersionList versions={versions} />
        </div>
      )}
    </Container>
  );
}

function App() {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVersions = () => {
    setLoading(true);
    axios
      .get(`/api/versions`)
      .then((res) => setVersions(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVersions();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Dashboard versions={versions} loading={loading} />}
        />
        <Route
          path="/upload"
          element={<UploadPage onUploadSuccess={loadVersions} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;