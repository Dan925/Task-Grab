import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
} from "@mui/material";

import axiosInstance from "../../services/Axios";

import CustomBtn from "../Common/Button";
import Form from "../Common/Form";

const CreateGroup = () => {
  const { t } = useTranslation();
  const { data } = useFetch("users/");
  const history = useHistory();

  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(false);
  const listAvailableUsers = () => {
    if (data) {
      return data.map((m, i) => (
        <MenuItem key={m.id} value={m}>
          {m.user_name}
        </MenuItem>
      ));
    }
  };

  const onSubmit = async () => {
    if (!name) setError(true);
    else {
      const group_members = members.map((m) => m.id);
      const group = { group_members, name };
      try {
        const res = await axiosInstance.post("users/groups/", group);

        if (res && res.status === 201) {
          toast.success("Group created successfully");
          console.log("New Group created");
          history.push("/dashboard");
        }
      } catch (e) {
        console.log("Exception: ", e.message);
      }
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setMembers(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div>
      <Form>
        <h2>Create Group</h2>

        <FormControl>
          <TextField
            required
            id="outlined-required"
            onChange={(e) => setName(e.target.value)}
            value={name}
            label="Name"
          />
          {error && <FormHelperText error>*name field required</FormHelperText>}
        </FormControl>

        <FormControl>
          <InputLabel id="members-select-label">Group members</InputLabel>
          <Select
            labelId="members-select-label"
            id="members-select"
            label="Team Members"
            value={members}
            onChange={handleChange}
            multiple
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value.id} label={value.user_name} />
                ))}
              </Box>
            )}
          >
            {listAvailableUsers()}
          </Select>
        </FormControl>

        <CustomBtn onClick={onSubmit}> Create Group</CustomBtn>
      </Form>
    </div>
  );
};

export default CreateGroup;
