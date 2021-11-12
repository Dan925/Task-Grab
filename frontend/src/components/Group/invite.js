import React from "react";
import Form from "../Common/Form";
import CustomBtn from "../Common/Button";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "../../services/Axios";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import useFetch from "../../hooks/useFetch";
import Utils from "../../utils";
import toast from "react-hot-toast";
import { useHistory } from "react-router";
function InviteUser() {
  const {
    handleSubmit,
    getValues,
    control,
    setError,
    formState: { errors },
  } = useForm();
  const { data } = useFetch("users/groups/");
  const history = useHistory();

  const userInGroup = (email, group_id) => {
    const members = data.find((group) => group.id === group_id)?.members;
    return members.find((m) => m.email.toLowerCase() === email.toLowerCase());
  };
  const onSubmit = async () => {
    const values = getValues();
    if (!values.group)
      setError("group", { type: "required", message: "group is required" });
    if (!values.email)
      setError("email", { type: "required", message: "email is required" });
    else if (!Utils.validateEmail(values.email))
      setError("email", { type: "invalid", message: "email is invalid" });
    else if (userInGroup(values.email, values.group))
      setError("email", {
        type: "invalid",
        message: "user is already in this group",
      });
    else {
      try {
        const res = await axiosInstance.post("users/invitations/", values);

        if (res && res.status === 201) {
          toast.success("User invited successfully");
          console.log("Invitation created");
          history.push("/dashboard");
        }
      } catch (e) {
        console.log("Exception: ", e.message);
      }
    }
  };
  return (
    <div>
      <Form>
        <h2>Invite User</h2>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControl>
              <TextField
                required
                id="outlined-required"
                onChange={onChange}
                value={value ?? ""}
                label="Email"
              />
              {errors.email && (
                <FormHelperText error>*{errors.email.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
        <Controller
          name="group"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControl required>
              <InputLabel id="team-select-label">Team</InputLabel>
              <Select
                labelId="team-select-label"
                label="Team"
                value={value ?? ""}
                onChange={onChange}
              >
                {data &&
                  data.map((team, index) => (
                    <MenuItem key={index} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.group && (
                <FormHelperText error>*{errors.group.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <CustomBtn
          size="large"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          Invite User
        </CustomBtn>
      </Form>
    </div>
  );
}

export default InviteUser;
