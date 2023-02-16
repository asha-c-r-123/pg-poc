import { useState, useEffect } from "react";
import axios from "axios";

const UseFetchWithCache = (url, options) => {
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [errorData, setErrorData] = useState(null);
  const [dataVersion, setDataVersion] = useState(null);

  useEffect(() => {
    const cachedData = sessionStorage.getItem(url);
    const cachedDataVersion = sessionStorage.getItem(`${url}_version`);
    if (cachedData && cachedDataVersion === dataVersion) {
      setData(JSON.parse(cachedData));
    } else {
      fetchData();
    }
  }, [url, dataVersion]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const response = await axios(url, options);
      const newVersion = response.headers["data-version"];
      if (newVersion !== dataVersion) {
        setDataVersion(newVersion);
        setData(response.data);
        sessionStorage.setItem(url, JSON.stringify(response.data));
        sessionStorage.setItem(`${url}_version`, newVersion);
      } else {
        setData(JSON.parse(sessionStorage.getItem(url)));
      }
    } catch (err) {
      setErrorData(err);
    } finally {
      setLoadingData(false);
    }
  };

  return [data, loadingData, errorData, fetchData];
};
export default UseFetchWithCache;
