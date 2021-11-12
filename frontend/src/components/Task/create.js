import React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import useFetch from "../../hooks/useFetch";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";

import toast from "react-hot-toast";

import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";

import axiosInstance from "../../services/Axios";
import CustomBtn from "../Common/Button";
import Form from "../Common/Form";

export default function CreateTask() {
  const { data } = useFetch("users/groups/");
  const history = useHistory();

  const {
    handleSubmit,
    control,
    getValues,
    setError,
    formState: { errors },
  } = useForm();
  const watchTeam = useWatch({
    control,
    name: "group",
    defaultValue: false,
  });
  const listTeamMembers = () => {
    if (data) {
      const team = data.find((team) => team.id === watchTeam);
      if (team) {
        return team.members.map((m, i) => (
          <MenuItem key={i} value={m}>
            {m.user_name}
          </MenuItem>
        ));
      }
    }
  };

  const { t } = useTranslation();

  const onSubmit = async () => {
    const values = getValues();
    const { assignee } = values;

    if (!values.title)
      setError("title", { type: "required", message: "title is required" });

    if (!values.group)
      setError("group", { type: "required", message: "group is required" });
    else {
      try {
        const res = await axiosInstance.post("tasks/", {
          ...values,
          assignee: assignee?.id,
        });

        if (res && res.status === 201) {
          toast.success(t("create.taskAddedMsg"));
          console.log("New Task added");
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
        <h2>{t("create.header")}</h2>

        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControl>
              <TextField
                required
                id="outlined-required"
                onChange={onChange}
                value={value ?? ""}
                label="Title"
              />
              {errors.title && (
                <FormHelperText error>*{errors.title.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              multiline
              id="outlined-required"
              onChange={onChange}
              value={value}
              label="Description"
            />
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

        {watchTeam && (
          <Controller
            name="assignee"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl>
                <Select
                  value={value ?? ""}
                  onChange={onChange}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) return <em>Unassigned</em>;
                    return selected.user_name;
                  }}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {listTeamMembers()}
                </Select>
              </FormControl>
            )}
          />
        )}

        <CustomBtn onClick={handleSubmit(onSubmit)}> Create Task</CustomBtn>
      </Form>
    </div>
  );
}
