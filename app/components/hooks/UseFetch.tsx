import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url);
        if (isMounted) {
          // assume API returns { data: ... }
          setData(response.data.data as T);
        }
      } catch (err) {
        if (isMounted) setError(err as AxiosError);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
