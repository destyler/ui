import { Dynamic, useDynamic } from '../index'

export function RootProvider() {
  const dynamic = useDynamic()

  return (
    <>
      <button type="button" onClick={() => dynamic.focus()}>Focus</button>

      <Dynamic.RootProvider value={dynamic}>
        <Dynamic.Context>
          {dynamicContext => (
            <>
              <Dynamic.Label>Frameworks</Dynamic.Label>
              <Dynamic.Control>
                {dynamicContext.value.map((value, index) => (
                  <Dynamic.Item key={index} index={index} value={value}>
                    <Dynamic.ItemPreview>
                      <Dynamic.ItemText>{value}</Dynamic.ItemText>
                      <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
                    </Dynamic.ItemPreview>
                    <Dynamic.ItemInput />
                  </Dynamic.Item>
                ))}
                <Dynamic.Input placeholder="Add Framework" />
                <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
              </Dynamic.Control>
            </>
          )}
        </Dynamic.Context>
        <Dynamic.HiddenInput />
      </Dynamic.RootProvider>
    </>
  )
}
