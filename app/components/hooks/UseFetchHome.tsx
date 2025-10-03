import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

function useFetchHome<T>(url: string) {
    const [homeData, setHomeData] = useState<T | null>(null);
    const [homeLoading, setHomeLoading] = useState(true);
    const [homeError, setHomeError] = useState<AxiosError | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setHomeLoading(true);
            try {
                const response = await axios.get(url);
                if (isMounted) {
                    // assume API returns { data: ... }
                    setHomeData(response.data.data as T);
                }
            } catch (err) {
                if (isMounted) setHomeError(err as AxiosError);
            } finally {
                if (isMounted) setHomeLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [url]);

    return { homeData, homeLoading, homeError };
}

export default useFetchHome;
