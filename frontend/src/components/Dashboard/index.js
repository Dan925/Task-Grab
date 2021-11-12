import React, { useContext, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Tasks from "../Task/index";
import { TaskContext } from "../../context/TaskContext";

const Dashboard = () => {
  const { dispatch } = useContext(TaskContext);
  const { data, isLoading, error } = useFetch("tasks/");

  useEffect(() => {
    dispatch({ type: "SET_TASKS", payload: { data, isLoading, error } });
  }, [data, isLoading, error]);
  return (
    <div className="home-content">
      {error && <div>{error}</div>}
      {isLoading && <div>Loading.... </div>}
      {data && <Tasks />}
    </div>
  );
};
export default Dashboard;
