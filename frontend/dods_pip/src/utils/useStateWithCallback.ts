import { useCallback, useEffect, useRef, useState } from 'react';

function useStateCallback<T>(initialState: T): [T, (state: T, cb: any) => void] {
  const [state, setState] = useState<T>(initialState);
  const cbRef = useRef(null); // init mutable ref container for callbacks

  const setStateCallback = useCallback<(state: T, cb: any) => void>((state, cb) => {
    cbRef.current = cb; // store current, passed callback in ref
    setState(state);
  }, []); // keep object reference stable, exactly like `useState`

  useEffect(() => {
    // cb.current is `null` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}

export default useStateCallback;
