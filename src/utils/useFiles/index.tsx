import { useFileUpload } from "./fileUtils";
import React from "react";

const FileInput = ({ id }) => {
  const { files, progress, handleFileChange, uploadFile } = useFileUpload();

 

  return (
    <div>
      <input type="file" id={ id } hidden multiple onChange={handleFileChange} />
      

      {/* {files.map((file) => (
        <div key={file.file_id}>
          <p>{file.file.name} - {file.status}</p>
          <p>Progress: {progress.find(p => p.file_id === file.file_id)?.progress}%</p>
          {file.status === "pending" && (
            <button onClick={() => uploadFile(file)}>Upload</button>
          )}
        </div>
      ))} */}
    </div>
  );
};

export default FileInput
