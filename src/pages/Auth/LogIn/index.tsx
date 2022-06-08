import React from "react";
import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Container from "components/Container";

const Auth = () => {
  return (
    <Container centered>
      <Typography variant="h4" mb={3}>
        Log in
      </Typography>
      <Card elevation={6} sx={{ minWidth: "400px" }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField label="Email" />
            <TextField label="Password" />
            <Button variant="contained" color="error">
              Sign in
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Auth;
