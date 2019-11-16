import React, { useCallback } from "react";
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
  const onDrop = useCallback(
    ([file]) => {
      uploadFile({ variables: { file } });
    },
    [uploadFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
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
      )}
    </div>
  );
};
