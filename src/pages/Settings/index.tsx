import React from "react";
import { useSearchParams } from "react-router-dom";

import Container from "components/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import BannerSettings from "pages/Settings/Banner";
import { SERVER_URL } from "config.keys";
import { Typography } from "@mui/material";

const SettingsPage = () => {
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success") === "true";
  const error = searchParams.get("error");

  return (
    <Container>
      <Stack spacing={2} alignItems="flex-start">
        <BannerSettings />
        <Button
          variant="contained"
          onClick={() =>
            (window.location.href = `${SERVER_URL}/api/get-refresh-token`)
          }
        >
          Generate Refresh Token
        </Button>
        {success && (
          <Typography variant="body2" color="success.main">
            Refresh Token Generated!
          </Typography>
        )}
        {error && (
          <Typography variant="body2" color="error.main">
            Error: {error}
          </Typography>
        )}
      </Stack>
    </Container>
  );
};

export default SettingsPage;
