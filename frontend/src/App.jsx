import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Container, CircularProgress, Button } from "@mui/material";
import VersionList from "./components/VersionList";
import UploadPage from "./components/UploadPage";
import axios from "axios";
import logo from './assets/logo.png';
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

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
      <img src={logo} alt="Swabam Logo" className="logo-videogame" />
      <h1 className="title-videogame">Benvenuto, stai per giocare a Swabam!</h1>
      <p className="subtitle-videogame">
        Scegli una versione da scaricare
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
      .get(`${API_URL}/versions`)
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