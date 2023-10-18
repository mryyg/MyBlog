---
title:  custom hooks
date: {{ date }}
tags:
---

一些平时项目中封装的自定义hooks

<!-- more -->
1. useWatch

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

2. useEffectAsync

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

3. useForm
```
export default () => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [validates, setValidates] = useState({});

    const register = (name, { defaultValue, validate }) => {
        if (!name) throw new Error('name is required');
        if (formData[name] === undefined) setFormData((prev) => ({ ...prev, [name]: defaultValue || '' }))
        if (errors[name] === undefined) setErrors((prev) => ({ ...prev, [name]: '' }));
        if (validate && validates[name] === undefined) setValidates((prev) => ({ ...prev, [name]: validate }))

        return {
            value: formData[name] || '',
            error: !!errors[name],
            onChange: (event) => {
                const { value } = event.target;
                setFormData((prev) => ({ ...prev, [name]: value }));
                validate && setErrors((prev) => ({ ...prev, [name]: validate(value) }));
            },
            onBlur: () => {
                validate && setErrors((prev) => ({ ...prev, [name]: validate(formData[name]) }));
            },
        };
    }

    const unregister = (name) => {
        if (!name) throw new Error('name is required');
        setFormData((prev) => {
            const { [name]: _, ...rest } = prev;
            return rest;
        });
        setErrors((prev) => {
            const { [name]: _, ...rest } = prev;
            return rest;
        });
        setValidates((prev) => {
            const { [name]: _, ...rest } = prev;
            return rest;
        });
    }

    const handleSubmit = (callback) => {
        if (!callback) throw new Error('callback is required');
        const newErrors = Object.keys(validates).reduce((acc, name) => {
            if (validates[name]) {
                acc[name] = validates[name](formData[name]);
            }
            return acc;
        }, {});

        setErrors(newErrors);

        if (Object.values(newErrors).every((error) => !error)) {
            callback(formData);
        }
    }

    const updataFormData = (newFormData, validate = true) => {
        if(!newFormData) throw new Error('newFormData is required');
        setFormData((prev) => ({ ...prev, ...newFormData }));
        validate && Object.keys(newFormData).forEach((name) => {
            if (validates[name]) {
                setErrors((prev) => ({ ...prev, [name]: validates[name](newFormData[name]) }));
            }
        })
    }

    return ({ register, handleSubmit, formState: { formData, errors }, updataFormData, unregister })
}
```

4. useDictionary

```
interface IDictionary {
  langCode: string
  dicList: IDicItem[]
}

export default function useDictionary(dicKey: string): IDicItem[] {
  const [val, setVal] = useState<IDictionary>({ langCode: '', dicList: [] })
  const { langCode } = useSelector(commonSelecter)

  const setValFunc = (dicList: IDicItem[]) => {
    storage.session.set(dicKey as any, { langCode, dicList })
    setVal({ langCode: langCode, dicList })
  }

  const getValFunc = async () => {
    if (!langCode) return
    const res = await getTranslatesByTopDictKeyApi(dicKey, langCode)
    if (res.success && res.data) {
      setValFunc(res.data)
    }
  }

  useEffect(() => {
    if (storage.session.get(dicKey as any, '') && storage.session.get(dicKey as any, '').langCode === langCode) {
      setVal(storage.session.get(dicKey as any, ''))
    } else {
      getValFunc()
    }
  }, [langCode])

  return val.dicList
}
```

5. useClientSize
```
type BreakpointChecks = {
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
}

const useClientSize = () => {
    const [clientWidth, setClientWidth] = useState(0)

    const [breakpointChecks, setBreakpointChecks] = useState<BreakpointChecks>({
        isMobile: false,
        isTablet: false,
        isDesktop: false,
    })

    const checkBreakpoints = (clientWidth: number) => {
        const isMobile = clientWidth < 768
        const isTablet = clientWidth >= 768 && clientWidth < 992
        const isDesktop = clientWidth >= 992
        setBreakpointChecks({ isMobile, isTablet, isDesktop })
    }

    const onResize = () => {
        setClientWidth(window.innerWidth)
        checkBreakpoints(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [onResize])

    useEffect(()=>{
        setClientWidth(window.innerWidth)
        checkBreakpoints(window.innerWidth)
    },[])

    return {
        clientWidth,
        ...breakpointChecks,
    }
}

export default useClientSize
```
