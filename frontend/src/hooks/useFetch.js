import { useEffect, useState } from "react";
import axiosInstance from "../services/Axios";

//custom hook
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const controller = new AbortController();

  useEffect(() => {
    axiosInstance
      .get(url, { signal: controller.signal })
      .then((res) => {
        if (!res || res.status !== 200) {
          throw Error("could not fetch resource");
        } else {
          setData(res.data);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
    return () => {
      controller.abort();
    };
  }, [url]);

  return { isLoading, data, error, setData };
};

export default useFetch;
