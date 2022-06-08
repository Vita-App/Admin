import React, { useMemo, useRef } from "react";
import Container from "components/Container";
import { Button, Stack, TextField, Typography } from "@mui/material";

const OtpPage = () => {
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
  };

  const onSubmit = () => {
    const otp = refs.map((ref) => ref.current!.value).join("");

    if (otp.length !== 6) return;

    console.log(otp);
  };

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
      <Button variant="contained" color="success" onClick={onSubmit}>
        Submit
      </Button>
    </Container>
  );
};

export default OtpPage;
