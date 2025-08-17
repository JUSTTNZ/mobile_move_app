import { useState, useEffect } from 'react';
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true ) => {   
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
        } finally {
            setLoading(false);
        }
    };

    const resetFunction = () => {
        setData(null);
        setError(null);
        setLoading(false);
    }

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, []);

    return { data, error, loading, fetchData, resetFunction };
}


export default useFetch;

