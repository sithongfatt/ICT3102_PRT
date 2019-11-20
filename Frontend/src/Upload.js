import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";

var filename = "";

const uploadFileMutation = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file)
  }
`;

const filesQuery = gql`
  {
    yoloImage
    yoloResponse {
      label
      confidence
      topLeft
      topRight
      bottomLeft
      bottomRight
    }
  }
`;

export const Upload = () => {
  const [uploadFile] = useMutation(uploadFileMutation, {
    refetchQueries: [{ query: filesQuery }]
  });

  const { data, loading } = useQuery(filesQuery);
  console.log(data);
  console.log(loading);
  
  // Queried returns result
  if (data != null) {
    // Check if the file is a new file
    if (data.yoloImage != filename) {
      // File needs to be drawn on
      console.log("I AM GOING TO DRAW");
      console.log(data.yoloResponse);
      filename = data.yoloImage;
    } else {
      console.log("no need to draw");
    }
  } 

  const [file, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: acceptedFiles => {
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
    width: "100%",
    height: 500,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner = {
    display: 'block',
    marginLeft: "auto",
    marginRight: "auto",
    width: "50%"
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
    </div>
  );
};
