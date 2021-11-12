import React from "react";
import { useTranslation } from "react-i18next";
const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="not-found">
      <h1>Oops!</h1>
      <br />
      <br />
      <h4>{t("notFound.msg1")}</h4>
      <p>{t("notFound.msg2")}</p>
    </div>
  );
};

export default NotFound;
