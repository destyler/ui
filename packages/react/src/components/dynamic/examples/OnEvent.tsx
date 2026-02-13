import { Dynamic } from '../index'

export function OnEvent() {
  return (
    <Dynamic.Root
      // eslint-disable-next-line no-console
      onValueChange={details => console.log(details)}
      // eslint-disable-next-line no-console
      onHighlightChange={details => console.log(details)}
      // eslint-disable-next-line no-console
      onValueInvalid={details => console.log(details)}
    >
      <Dynamic.Context>
        {tagsInput => (
          <>
            <Dynamic.Label>Frameworks</Dynamic.Label>
            <Dynamic.Control>
              {tagsInput.value.map((value, index) => (
                <Dynamic.Item key={index} index={index} value={value}>
                  <Dynamic.ItemInput />
                  <Dynamic.ItemText>{value}</Dynamic.ItemText>
                  <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
                </Dynamic.Item>
              ))}
              <Dynamic.Input placeholder="Add Framework" />
              <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
            </Dynamic.Control>
          </>
        )}
      </Dynamic.Context>
      <Dynamic.HiddenInput />
    </Dynamic.Root>
  )
}
