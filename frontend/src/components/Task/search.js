import { useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TaskContext } from "../../context/TaskContext";
import {
  ASSIGNEE,
  FILTER_BY_MAP,
  STATUS_DONE,
  STATUS_NOT_DONE,
  TITLE,
  UNASSIGNED,
} from "./constants";
import TaskList from "./list";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import { Controller, useForm, useWatch } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  advFilters: {
    display: "block",
    width: "18em",
    position: "absolute",
    right: "12vw",

    zIndex: 20,
  },
  form: {
    width: "20em",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    boxShadow: "4px 4px 10px rgba(0,0,0,.25)",
    gap: "1rem",
    backgroundColor: "#fff",
  },
  hdr: {
    display: "flex",
    justifyContent: "space-between",
  },
  clrBtn: {
    width: "10em",
  },
}));

const SearchBar = ({ teams }) => {
  const {
    state: { tasks },
    dispatch,
  } = useContext(TaskContext);

  const classes = useStyles();
  const { t } = useTranslation();

  const [advSearch, setAdvSearch] = useState(false);
  const [sortValue, setSortValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [query, setQuery] = useState("");

  const {
    control,
    formState: { errors },
  } = useForm();
  const watchTeam = useWatch({
    control,
    name: "group",
    defaultValue: false,
  });

  const getUsernameByIDTeamId = (personId, teamId) => {
    return teams
      .find((t) => t.id === teamId)
      .members.find((m) => m.id === personId)?.user_name;
  };

  const onQueryChange = (e) => setQuery(e.target.value);
  const onSortValueChange = (e) => setSortValue(e.target.value);
  const onStatusFilterChange = (e) => setStatusFilter(e.target.value);
  const onAssigneeFilterChange = (e) => setAssigneeFilter(e.target.value);

  const handleClearAdvSrch = () => {
    setSortValue("");
    setStatusFilter("");
    setAssigneeFilter("");
  };

  const isTaskQueryMatch = ({ task, query }) => {
    return task.title.toLowerCase().trim().includes(query.toLowerCase().trim());
  };

  const isTaskStatusFilterMatch = ({ task }) => {
    return task.status === (statusFilter === FILTER_BY_MAP[STATUS_DONE]);
  };
  const isTaskAssigneeFilterMatch = ({ task }) => {
    return assigneeFilter === UNASSIGNED
      ? !task.assignee
      : task.assignee === assigneeFilter && task.group === watchTeam;
  };
  const swapTasksBySortValue = ({ taskA, taskB }) => {
    switch (sortValue) {
      case SORT_BY[TITLE]:
        return taskA.title.toLowerCase() > taskB.title.toLowerCase() ? 1 : -1;
      case SORT_BY[ASSIGNEE]:
        return taskA.group === taskB.group &&
          getUsernameByIDTeamId(taskA.assignee, taskA.group)?.toLowerCase() >
            getUsernameByIDTeamId(taskB.assignee, taskB.group)?.toLowerCase()
          ? 1
          : -1;

      default:
        return -1; //no filtering done
    }
  };

  const handleMarkAsDone = useCallback(async (task) => {
    try {
      const res = await axiosInstance.patch(`tasks/${task.id}/`, {
        is_done: true,
      });

      if (res && res.status === 200) {
        dispatch({ type: "MARK_DONE", payload: task.id });
        console.log("Task '" + task.title + "' marked as done");
        return true;
      } else {
        console.log("ERROR: Marking as Done");
        return false;
      }
    } catch (e) {
      console.log("Exception: ", e.message);
      return false;
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    const conf = window.confirm(t("confirmMsg"));

    if (conf) {
      try {
        const res = axiosInstance.delete(`tasks/${id}/`);
        if (res && res.status === 204) {
          dispatch({ type: "DELETE_TASK", payload: id });
          console.log("Task deleted");
          return true;
        } else {
          console.log("ERROR: Deleting Task");
          return false;
        }
      } catch (e) {
        console.log("Exception: ", e.message);
        return false;
      }
    }
    return false;
  }, []);

  const visibleTasks = useMemo(() => {
    let returnedTasks = tasks;
    if (query) {
      returnedTasks = returnedTasks.filter((t) =>
        isTaskQueryMatch({ task: t, query })
      );
    }
    if (statusFilter) {
      returnedTasks = returnedTasks.filter((t) =>
        isTaskStatusFilterMatch({ task: t })
      );
    }
    if (assigneeFilter && watchTeam) {
      returnedTasks = returnedTasks.filter((t) =>
        isTaskAssigneeFilterMatch({ task: t })
      );
    }
    if (sortValue) {
      returnedTasks = returnedTasks.sort((a, b) =>
        swapTasksBySortValue({ taskA: a, taskB: b })
      );
    }
    return returnedTasks;
  }, [tasks, query, sortValue, assigneeFilter, statusFilter]);

  const visibleTeams = useMemo(() => {
    let visibleTaskGroupIds = visibleTasks.map((vTask) => vTask.group);
    return teams.filter((team) => visibleTaskGroupIds.includes(team.id));
  }, [teams, visibleTasks]);

  return (
    <div className="search-bar-container">
      <div>
        <div className="search-bar">
          <input
            type="text"
            name="search"
            className="form-control"
            placeholder={t("main.searchBar.pholder")}
            value={query}
            onChange={onQueryChange}
          />
        </div>
        <div className="adv-search">
          <IconButton onClick={() => setAdvSearch(!advSearch)} color="primary">
            <SortIcon />
            <FilterAltIcon />
          </IconButton>
        </div>
      </div>

      {advSearch && (
        <Box className={classes.advFilters}>
          <Box
            className={classes.form}
            component="form"
            noValidate
            autoComplete="off"
          >
            <div className={classes.hdr}>
              <Typography variant="h6" textAlign="center">
                Sort/Filters
              </Typography>
              <Button
                size="small"
                className={classes.clrBtn}
                onClick={handleClearAdvSrch}
              >
                Clear
              </Button>
            </div>

            <FormControl>
              <InputLabel id="sort-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-select-label"
                label="Sort By"
                value={sortValue}
                onChange={onSortValueChange}
              >
                <MenuItem value={SORT_BY[TITLE]}>Title</MenuItem>
                <MenuItem value={SORT_BY[ASSIGNEE]}>Assignee</MenuItem>
              </Select>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Filter By Status:</FormLabel>
              <RadioGroup
                value={statusFilter}
                onChange={onStatusFilterChange}
                row
              >
                <FormControlLabel
                  value={FILTER_BY[STATUS_DONE]}
                  control={<Radio />}
                  label="Done"
                />
                <FormControlLabel
                  value={FILTER_BY[STATUS_NOT_DONE]}
                  control={<Radio />}
                  label="Not Done"
                />
              </RadioGroup>
            </FormControl>

            <FormLabel component="legend">Filter By Assignee:</FormLabel>

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
                    {teams.map((team, index) => (
                      <MenuItem key={index} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.group && (
                    <FormHelperText error>
                      *{errors.group.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {watchTeam && (
              <FormControl>
                <InputLabel id="assignee-select-label">Assignee</InputLabel>
                <Select
                  labelId="assignee-select-label"
                  value={assigneeFilter}
                  onChange={onAssigneeFilterChange}
                  label="Assignee"
                >
                  <MenuItem value={UNASSIGNED}>Unassigned</MenuItem>
                  {teams
                    .find((team) => team.id === watchTeam)
                    ?.members.map((m, i) => (
                      <MenuItem key={i} value={m.id}>
                        {m.user_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>
      )}
      <hr />
      <TaskList
        tasks={visibleTasks}
        teams={visibleTeams}
        handleMarkAsDone={handleMarkAsDone}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default SearchBar;
