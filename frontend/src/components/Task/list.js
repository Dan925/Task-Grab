import React, { useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

import TaskDetails from "./detail";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const TaskList = ({ tasks, teams, handleDelete, handleMarkAsDone }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  return (
    <div>
      <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          indicatorColor="secondary"
        >
          {teams &&
            teams.map((team, index) => (
              <Tab label={team.name} {...a11yProps(index)} />
            ))}
        </Tabs>
        {teams.map((team, index) => (
          <TabPanel value={value} index={index}>
            {tasks
              .filter((task, index) => task.group === team.id)
              .map((item) => (
                <TaskDetails
                  key={item.id}
                  task={item}
                  handleDelete={handleDelete}
                  handleCheck={handleMarkAsDone}
                  team={team}
                />
              ))}
          </TabPanel>
        ))}
      </Box>
    </div>
  );
};

export default TaskList;
