import { Edit, useEdit } from '../index'

export function RootProvider() {
  const editable = useEdit({ placeholder: 'Placeholder' })

  return (
    <>
      <button type="button" onClick={() => editable.edit()}>Edit</button>

      <Edit.RootProvider value={editable}>
        <Edit.Label>Label</Edit.Label>
        <Edit.Area>
          <Edit.Input />
          <Edit.Preview />
        </Edit.Area>
      </Edit.RootProvider>
    </>
  )
}
