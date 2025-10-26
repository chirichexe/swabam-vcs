import React from "react";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import "./VersionList.css";

const VersionList = ({ versions }) => {
  return (
    <Stack spacing={2} sx={{ mt: 2, alignItems: "center" }}>
      {versions.map((v) => (
        <Card key={v.id} className="version-card">
          <CardContent className="version-content">
            <Typography className="version-title">{v.name}</Typography>
            <Typography className="version-date">{v.date}</Typography>
            <Button variant="contained" href={v.url} className="download-btn">
              Scarica
            </Button>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default VersionList;
