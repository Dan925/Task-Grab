import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import useFetch from "../../hooks/useFetch";
import SearchBar from "./search";
const Tasks = () => {
  const { isLoading, data: teams, error } = useFetch("users/groups/");
  const { t } = useTranslation();
  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>{t("main.header")}</h2>
        <Link to="/create-task" id="plus-link">
          <FaPlusCircle size="30px" />
        </Link>
      </div>
      {error && <div>{error}</div>}

      {isLoading && <div>{t("Loading")} </div>}
      {teams && <SearchBar teams={teams} />}
    </div>
  );
};

export default Tasks;
