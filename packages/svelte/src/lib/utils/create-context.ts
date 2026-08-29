import { getContext, hasContext, setContext } from 'svelte'

interface CreateContextBaseOptions {
  name?: string
  hookName?: string
  providerName?: string
  errorMessage?: string
}

interface StrictCreateContextOptions<T> extends CreateContextBaseOptions {
  defaultValue?: T
  strict?: true
}

interface DefaultCreateContextOptions<T> extends CreateContextBaseOptions {
  defaultValue: T
  strict: false
}

interface OptionalCreateContextOptions extends CreateContextBaseOptions {
  defaultValue?: undefined
  strict: false
}

type CreateContextOptions<T>
  = | StrictCreateContextOptions<T>
    | DefaultCreateContextOptions<T>
    | OptionalCreateContextOptions

export interface RequiredContextConsumer<T> {
  (fallback: T): T
  (): T
}

export interface OptionalContextConsumer<T> {
  (fallback: T): T
  (): T | undefined
}

type RequiredCreateContextReturn<T> = [(value: T) => void, RequiredContextConsumer<T>, symbol]
type OptionalCreateContextReturn<T> = [(value: T) => void, OptionalContextConsumer<T>, symbol]

function getErrorMessage(hook: string, provider: string) {
  return `${hook} returned \`undefined\`. Seems you forgot to wrap component within ${provider}`
}

export function createContext<T>(options: OptionalCreateContextOptions): OptionalCreateContextReturn<T>
export function createContext<T>(options: DefaultCreateContextOptions<T>): RequiredCreateContextReturn<T>
export function createContext<T>(options: StrictCreateContextOptions<T>): RequiredCreateContextReturn<T>
export function createContext<T>(
  options: CreateContextOptions<T>,
): RequiredCreateContextReturn<T> | OptionalCreateContextReturn<T>
export function createContext<T>(options: CreateContextOptions<T>) {
  const {
    name,
    strict = true,
    hookName = 'useContext',
    providerName = 'Provider',
    errorMessage,
    defaultValue,
  } = options

  const contextId = Symbol(name)

  const provider = (value: T) => {
    setContext(contextId, value)
  }

  const consumer = (fallback?: T) => {
    const exists = hasContext(contextId)
    if (exists)
      return getContext<T>(contextId)
    if (fallback !== undefined)
      return fallback
    if (defaultValue !== undefined)
      return defaultValue
    if (strict) {
      const error = new Error(errorMessage ?? getErrorMessage(hookName, providerName))
      error.name = 'ContextError'
      throw error
    }
    return undefined
  }

  return [provider, consumer, contextId] as OptionalCreateContextReturn<T>
}
