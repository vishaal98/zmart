import { Box, Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

const AddNewAddressView = ({ handleCancel, addAddress }) => {
  const {
    register: handleAddAddress,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleSubmitAddress = async (data) => {
    // console.log(data);
    await addAddress(data);
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(handleSubmitAddress)}
      display="flex"
      flexDirection="column"
      width={"80%"}
    >
      <TextField
        placeholder="Enter street"
        {...handleAddAddress("street", {
          required: { value: true, message: "Street cannot be empty" },
        })}
        error={Boolean(errors.street)}
        helperText={errors.street?.message}
      />
      <TextField
        placeholder="Enter city"
        {...handleAddAddress("city", {
          required: { value: true, message: "City cannot be empty" },
        })}
        error={Boolean(errors.city)}
        helperText={errors.city?.message}
      />
      <TextField
        placeholder="Enter state"
        {...handleAddAddress("state", {
          required: { value: true, message: "State cannot be empty" },
        })}
        error={Boolean(errors.state)}
        helperText={errors.state?.message}
      />
      <TextField
        placeholder="Enter pincode"
        type="number"
        {...handleAddAddress("pincode", {
          required: { value: true, message: "Pincode cannot be empty" },
        })}
        error={Boolean(errors.pincode)}
        helperText={errors.pincode?.message}
      />
      <Stack direction="row" my="1rem">
        <Button variant="contained" type="submit">
          Add
        </Button>
        <Button variant="text" onClick={handleCancel}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default AddNewAddressView;
