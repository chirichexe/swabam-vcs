import React from "react";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

const VersionList = ({ versions }) => {
  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      {versions.map((v) => (
        <Card key={v.id} sx={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Typography variant="h6">{v.name}</Typography>
              <Typography variant="body2" color="gray">
                Pubblicata il {v.date}
              </Typography>
            </div>
            <Button
              variant="contained"
              color="primary"
              href={v.url}
              sx={{ textTransform: "none" }}
            >
              Scarica
            </Button>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default VersionList;
