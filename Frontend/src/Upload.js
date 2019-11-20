import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { filesQuery } from "./Files";
import ImageUploader from 'react-images-upload';

const uploadFileMutation = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file)
  }
`;

export const Upload = () => {
  const [uploadFile] = useMutation(uploadFileMutation, {
    refetchQueries: [{ query: filesQuery }]
  });
  
  // const onDrop = useCallback(
  //   ([file]) => {
  //     uploadFile({ variables: { file } });
  //     console.log(file);
  //   },
  //   [uploadFile]
  // );

  const [file, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragActive} = useDropzone({
    
    onDrop: acceptedFiles => {
      // uploadFile({ variables:  [{file}] });
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file),
      },uploadFile({ variables: { file } }))));
    }
  });

  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  
  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };
  

  const thumbs = file.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }

{thumbs}
      {/* {isDragActive ? (
              <ImageUploader
              withIcon={true}
              buttonText='Dropping image'
              imgExtension={['.jpg', '.gif', '.png', '.gif']}
              maxFileSize={5242880}
              withPreview={true}
              />
      ) : (
        <ImageUploader
              withIcon={true}
              buttonText='Choose images or drop here'
              imgExtension={['.jpg', '.gif', '.png', '.gif']}
              maxFileSize={5242880}
              withPreview={true}
              />
      )} */}
    </div>
  );
};
