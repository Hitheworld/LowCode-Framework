import { useState, useEffect, useContext } from 'react';
import { EnvContext } from '@/factory';

export function useRequest(
  api: Types.Api,
  data?: object,
  options?: Types.FetchOptions
) {
  const [initLoading, setInitLoading] = useState(false);
  const [initData, setInitData] = useState<any | null>(null);

  const env = useContext(EnvContext);
  useEffect(() => {
    let didCancel: boolean = false;
    async function fetchInitData() {
      try {
        console.log('useRequest-env:', env);
        setInitLoading(true);
        const json: any = await env?.fetcher(api, data, {
          ...options,
        });
        console.log('useRequest-json:', json);
        if (!didCancel) {
          setInitLoading(false);
          setInitData(json?.data);
        }
      } catch (e) {}
    }
    fetchInitData();
    return () => {
      didCancel = true;
    };
  }, []);
  return {
    initLoading,
    initData,
  };
}
