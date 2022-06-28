import React from "react";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { TailSpin } from "react-loader-spinner";
import { useForm, Controller, FieldValues } from "react-hook-form";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SERVER_URL } from "config.keys";
import { BannerType } from "types";
import Loader from "components/Loader";
import { useSnackbar } from "notistack";

const getBanner = async () => {
  const { data } = await axios.get<BannerType>(`${SERVER_URL}/api/get-banner`);

  return data;
};

const updateBanner = async (formData: BannerType) => {
  const { data } = await axios.post<BannerType>(
    `${SERVER_URL}/api/modify-banner`,
    formData
  );

  return data;
};

const BannerSettings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading, isError, data } = useQuery("getBanner", getBanner);
  const mutation = useMutation(
    "updateBanner",
    (data: BannerType) => updateBanner(data),
    {
      onSuccess: () => {
        enqueueSnackbar("Banner Updated Successfully", { variant: "success" });
      },
      onError: () => {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
      },
    }
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData: FieldValues) => {
    mutation.mutate(formData as BannerType);
  };

  if (isLoading || isError || !data) return <Loader />;

  return (
    <Stack
      spacing={2}
      maxWidth="sm"
      alignItems="flex-start"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h4">Banner</Typography>
      <Controller
        name="content"
        control={control}
        rules={{ required: "Content is required" }}
        defaultValue={data.content || ""}
        render={({ field }) => (
          <TextField
            {...field}
            label="Content"
            fullWidth
            error={Boolean(errors.content)}
            helperText={errors.content?.message}
          />
        )}
      />
      <Controller
        name="height"
        control={control}
        rules={{ required: "Height is required" }}
        defaultValue={data.height || ""}
        render={({ field }) => (
          <TextField
            {...field}
            label="Height(px)"
            type="number"
            fullWidth
            error={Boolean(errors.height)}
            helperText={errors.height?.message}
          />
        )}
      />
      <Controller
        name="show"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            label="Show Banner"
            control={<Checkbox defaultChecked={data.show} {...field} />}
          />
        )}
      />
      <Button
        variant="contained"
        color="success"
        type="submit"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? (
          <TailSpin color="#000" width="30px" height="30px" />
        ) : (
          "Update"
        )}
      </Button>
    </Stack>
  );
};

export default BannerSettings;
