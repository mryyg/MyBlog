---
title:  custom hooks
date: {{ date }}
tags:
---

一些自定义hooks

<!-- more -->
1、react-hooks实现类似vue的watch功能

>代码

```
type Callback<T> = (prev: T | undefined) => void
type Config = {
  immediate: boolean
}

export function useWatch<T>(
  dep: T,
  callback: Callback<T>,
  config: Config = { immediate: false },
) {
  const { immediate } = config

  const prev = useRef<T>()
  const inited = useRef(false)

  useEffect(() => {
    const execute = () => callback(prev.current)

    if (!inited.current) {
      inited.current = true
      if (immediate) {
        execute()
      }
    } else {
      execute()
    }
    prev.current = dep
  }, [dep])
}
```

2、useEffectAsync

```
export const useEffectAsync = (effect, deps) => {
  const dispatch = useDispatch();
  const ref = useRef();
  useEffect(() => {
    effect()
      .then((result) => ref.current = result)
      .catch((error) => dispatch(errorsActions.push(error.message)));
      
    return () => {
      const result = ref.current;
      if (result) {
        result();
      }
    };
  }, [...deps, dispatch]);
};
```
