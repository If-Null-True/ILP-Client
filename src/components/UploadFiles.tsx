interface UploadFileProps {
    id: string
}

const submitFile = (event: any) => {
    console.log(event)
}

const UploadFile = (props: UploadFileProps) => {
    return (
        <form onSubmit={submitFile} action="" method="post" encType="multipart/form-data" id="upload-file">
            <span id="file-chosen" hidden></span>
            <input type="file" name="file" id="upload-file" value="Upload File" hidden />
        </form>
    )
}

export default UploadFile;