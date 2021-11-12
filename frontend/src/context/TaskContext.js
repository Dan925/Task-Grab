import React, { useReducer } from "react";

const initialState = {
  isLoading: true,
  error: null,
  tasks: null,
};

export const TaskContext = React.createContext(initialState);
const taskReducer = (state, action) => {
  switch (action.type) {
    case "SET_TASKS":
      return {
        isLoading: action.payload.isLoading,
        error: action.payload.error,
        tasks: action.payload.data,
      };
    case "MARK_DONE":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, is_done: true } : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id)
            return { ...task, ...action.payload.newT };
          return task;
        }),
      };
    default:
      return state;
  }
};
const TaskContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContextProvider;
