import { useState, useEffect, useCallback } from 'react';

const useFetch = <T,>(
  fetchFunction: () => Promise<T>,
  autoFetch: boolean = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);

  // stable runner; re-created only when fetchFunction changes
  const run = useCallback(async () => {
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
  }, [fetchFunction]);

  // auto-fetch on mount AND whenever fetchFunction identity changes
  useEffect(() => {
    if (autoFetch) run();
  }, [autoFetch, run]);

  return { data, error, loading, refetch: run };
};

export default useFetch;
