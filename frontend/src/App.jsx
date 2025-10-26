import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Divider } from "@mui/material";
import VersionList from "./components/VersionList";
import UploadModal from "./components/UploadModal";
import axios from "axios";

function App() {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVersions = () => {
    setLoading(true);
    axios
      .get("http://localhost:4000/api/versions")
      .then((res) => setVersions(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVersions();
  }, []);

  return (
    <Container sx={{ textAlign: "center", mt: 8, position: "relative" }}>
      <UploadModal onUploadSuccess={loadVersions} />

      <Box>
        <img
          src="/logo.png"
          alt="Swabam Logo"
          style={{ width: 120, height: 120, marginBottom: 16 }}
        />
        <Typography variant="h3" gutterBottom>
          Benvenuto su Swabam!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Scegli una versione da scaricare e inizia a giocare
        </Typography>

        <Divider sx={{ my: 3 }} />

        {loading ? <CircularProgress /> : <VersionList versions={versions} />}
      </Box>
    </Container>
  );
}

export default App;
