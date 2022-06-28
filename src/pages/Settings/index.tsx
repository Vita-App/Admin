import React from "react";

import Container from "components/Container";
import { Stack } from "@mui/material";
import BannerSettings from "pages/Settings/Banner";

const SettingsPage = () => {
  return (
    <Container>
      <Stack spacing={2}>
        <BannerSettings />
      </Stack>
    </Container>
  );
};

export default SettingsPage;
