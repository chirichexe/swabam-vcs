require('dotenv').config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

// Definisci BASE_DIR usando process.env
const BASE_DIR = process.env.BASE_DIR;

// Configurazione Multer: directory di destinazione e nomi file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, BASE_DIR),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

/* API endpoints*/
// file listing
app.get("/api/versions", (req, res) => {
  try {
    const files = fs.readdirSync(BASE_DIR);
    const result = files.map((file) => {
      const fullPath = path.join(BASE_DIR, file);
      const stats = fs.statSync(fullPath);

      return {
        name: file,
        date: stats.mtime.toISOString().split("T")[0],
        url: `/api/downloads/${encodeURIComponent(file)}`, // URL relativo invece di localhost
      };
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nella lettura dei file" });
  }
});

// file upload
app.post("/api/upload", (req, res) => {
  // pulisci la cartella prima di caricare il nuovo file
  if (fs.existsSync(BASE_DIR)) {
    const files = fs.readdirSync(BASE_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(BASE_DIR, file));
    }
  }

  // carica il nuovo file con Multer
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(500).json({ error: "Errore caricando il file" });
    if (!req.file) return res.status(400).json({ error: "Nessun file ricevuto" });

    console.log(`📦 File caricato: ${req.file.originalname}`);
    res.json({ message: "File caricato correttamente", filename: req.file.originalname });
  });
});


// file download
app.get("/api/downloads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(BASE_DIR, filename);
  res.download(filePath);
});

// file delete
app.delete("/api/delete/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(BASE_DIR, filename);
  
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Errore nella cancellazione del file" });
    }
    console.log(`🗑️ File cancellato: ${filename}`);
    res.json({ message: "File cancellato correttamente" });
  });
});

/* end API endpoints*/

app.listen(process.env.PORT || 4000, '0.0.0.0', () => {
  console.log(`✅ Backend in ascolto sulla porta ${process.env.PORT || 4000}`);
});
