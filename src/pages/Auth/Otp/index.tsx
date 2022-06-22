import React, { useEffect, useMemo, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import { useQuery } from "react-query";
import Container from "components/Container";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useSetRecoilState } from "recoil";
import { useSnackbar } from "notistack";
import { authState } from "store";
import { useLocation, useNavigate } from "react-router";
import { SERVER_URL } from "config.keys";

const verifyOtp = async (otp: string, email?: string) => {
  const { data } = await axios.post(`${SERVER_URL}/api/admin/verify-otp`, {
    email,
    otp,
  });

  return data;
};

const OtpPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading, data, isError, refetch } = useQuery(
    ["verifyOtp", otp],
    () => verifyOtp(otp, state as string),
    {
      enabled: false,
    }
  );
  const setAuthState = useSetRecoilState(authState);
  const ref1 = useRef<HTMLInputElement>();
  const ref2 = useRef<HTMLInputElement>();
  const ref3 = useRef<HTMLInputElement>();
  const ref4 = useRef<HTMLInputElement>();
  const ref5 = useRef<HTMLInputElement>();
  const ref6 = useRef<HTMLInputElement>();

  const refs = useMemo(() => [ref1, ref2, ref3, ref4, ref5, ref6], []);

  const onChange = (index: number) => {
    if (!Boolean(refs[index].current!.value)) {
      refs[index - 1 < 0 ? 5 : index - 1].current!.focus();
    } else {
      refs[(index + 1) % 6].current!.focus();
    }

    setOtp(refs.map((ref) => ref.current!.value).join(""));
  };

  const onSubmit = () => {
    if (otp.length !== 6) return;
    refetch();
  };

  useEffect(() => {
    if (data?.user) {
      setAuthState({
        isLoggedIn: true,
        user: data.user,
      });
      navigate("/");
    }

    if (isError) {
      enqueueSnackbar("Invalid or expired otp", { variant: "error" });
    }
  }, [data, isError, enqueueSnackbar, setAuthState, navigate]);

  return (
    <Container centered>
      <Typography variant="h4">Enter your OTP here</Typography>
      <Stack direction="row" spacing={2} my={2}>
        {refs.map((ref, index) => (
          <TextField
            key={index}
            inputRef={ref}
            sx={{
              width: "3rem",
            }}
            InputProps={{
              inputProps: {
                maxLength: 1,
                style: {
                  textAlign: "center",
                  fontSize: "1.5rem",
                },
              },
            }}
            onChange={() => onChange(index)}
          />
        ))}
      </Stack>
      <Button
        variant="contained"
        color="success"
        onClick={onSubmit}
        disabled={otp.length !== 6 || isLoading}
      >
        {isLoading ? (
          <TailSpin width="25px" height="25px" color="#000" />
        ) : (
          "Submit"
        )}
      </Button>
    </Container>
  );
};

export default OtpPage;
