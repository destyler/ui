import { Edit, useEdit } from '@destyler-ui/solid/edit'

export function RootProvider() {
  const edit = useEdit({ placeholder: 'Placeholder' })

  return (
    <>
      <button onClick={() => edit().edit()}>Edit</button>

      <Edit.RootProvider value={edit}>
        <Edit.Label>Label</Edit.Label>
        <Edit.Area>
          <Edit.Input />
          <Edit.Preview />
        </Edit.Area>
      </Edit.RootProvider>
    </>
  )
}
