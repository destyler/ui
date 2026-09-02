import { FileUpload, useFileUpload } from '@destyler-ui/solid/file-upload'
import { For } from 'solid-js'

export function RootProvider() {
  const fileUpload = useFileUpload({ maxFiles: 5 })

  return (
    <>
      <button onClick={() => fileUpload().clearFiles()}>Clear</button>

      <FileUpload.RootProvider value={fileUpload}>
        <FileUpload.Label>File Upload</FileUpload.Label>
        <FileUpload.Dropzone>Drag your file(s)here</FileUpload.Dropzone>
        <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
        <FileUpload.ItemGroup>
          <FileUpload.Context>
            {context => (
              <For each={context().acceptedFiles}>
                {file => (
                  <FileUpload.Item file={file}>
                    <FileUpload.ItemPreview type="image/*">
                      <FileUpload.ItemPreviewImage />
                    </FileUpload.ItemPreview>
                    <FileUpload.ItemPreview type=".*">Any Icon</FileUpload.ItemPreview>
                    <FileUpload.ItemName />
                    <FileUpload.ItemSizeText />
                    <FileUpload.ItemDeleteTrigger>X</FileUpload.ItemDeleteTrigger>
                  </FileUpload.Item>
                )}
              </For>
            )}
          </FileUpload.Context>
        </FileUpload.ItemGroup>
        <FileUpload.HiddenInput />
      </FileUpload.RootProvider>
    </>
  )
}
