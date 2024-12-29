import { useCallback, useEffect, useState } from 'react';

export function useUrlState<T extends string>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlValue = urlParams.get(key);
    return urlValue ? decodeURIComponent(urlValue) as T : defaultValue;
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (state === defaultValue) {
      urlParams.delete(key);
    } else {
      urlParams.set(key, encodeURIComponent(state));
    }
    const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [state, key, defaultValue]);

  return [state, setState] as const;
}
