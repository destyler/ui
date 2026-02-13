import { FileUpload, useFileUpload } from '../index'

export function RootProvider() {
  const fileUpload = useFileUpload({ maxFiles: 5 })

  return (
    <>
      <button onClick={() => fileUpload.clearFiles()}>Clear</button>

      <FileUpload.RootProvider value={fileUpload}>
        <FileUpload.Label>File Upload</FileUpload.Label>
        <FileUpload.Dropzone>Drop your files here</FileUpload.Dropzone>
        <FileUpload.Trigger>Choose file(s)</FileUpload.Trigger>
        <FileUpload.ItemGroup>
          <FileUpload.Context>
            {api => (
              <>
                {api.acceptedFiles.map(file => (
                  <FileUpload.Item key={file.name} file={file}>
                    <FileUpload.ItemPreview type="image/*">
                      <FileUpload.ItemPreviewImage />
                    </FileUpload.ItemPreview>
                    <FileUpload.ItemPreview type=".*">
                      <div>Generic Icon</div>
                    </FileUpload.ItemPreview>
                    <FileUpload.ItemName />
                    <FileUpload.ItemSizeText />
                    <FileUpload.ItemDeleteTrigger>X</FileUpload.ItemDeleteTrigger>
                  </FileUpload.Item>
                ))}
              </>
            )}
          </FileUpload.Context>
        </FileUpload.ItemGroup>
        <FileUpload.HiddenInput />
      </FileUpload.RootProvider>
    </>
  )
}
