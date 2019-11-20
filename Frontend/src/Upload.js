import React, { Component, useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
// reactstrap components
import {
  Row,
  Col
} from "reactstrap";

// Declaring variables
var filename = "";
var imageSource;

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

class Canvas extends React.Component {
  drawRectangle(ctx, label, confidence, ax, ay, bx, by) {
    const title = label + "(" + parseFloat(confidence.toFixed(3)) + ")";
    const w = bx - ax;
    const h = by - ay;

    ctx.rect(ax, ay, w, h);
    ctx.fillText(title, ax, ay);
  }
  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")
    const img = this.refs.image
    canvas.height = 200

    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "red";
      ctx.fillStyle = "black";
      ctx.font = "bold 8px Arial";
      ctx.textBaseline = "bottom";
      ctx.textAlign = "start";

      // 'topleft': {'x': 40, 'y': 56}, 'bottomright': {'x': 72, 'y': 73}
      this.drawRectangle(ctx, "TRUCK", 0.2966457, 40, 56, 72, 73)

      // 'topleft': {'x': 34, 'y': 62}, 'bottomright': {'x': 122, 'y': 160}
      this.drawRectangle(ctx, "CAR", 0.15046194, 34, 62, 122, 160)

      // 'topleft': {'x': 69, 'y': 54}, 'bottomright': {'x': 125, 'y': 84}
      this.drawRectangle(ctx, "TRUCK", 0.17571707, 69, 54, 125, 84)

      // 'topleft': {'x': 126, 'y': 61}, 'bottomright': {'x': 149, 'y': 74}
      this.drawRectangle(ctx, "TRUCK", 0.16826859, 126, 61, 149, 74)

      // 'topleft': {'x': 17, 'y': 40}, 'bottomright': {'x': 205, 'y': 164}
      this.drawRectangle(ctx, "TRUCK", 0.46485525, 17, 40, 205, 164)

      ctx.stroke();
    }
  }

  render() {
    return (
      <Col md="12">
        <Row>
          <Col md="6">
            <h6>Original {this.props.image.test}</h6>
            <img ref="image" src={this.props.image.source} className="hidden" />
          </Col>
          <Col md="6">
            <h6>Output</h6>
            <canvas ref="canvas" />
          </Col>
        </Row>
      </Col>
    )
  }
}

export const Upload = () => {
  const [uploadFile] = useMutation(uploadFileMutation, {
    refetchQueries: [{ query: filesQuery }]
  });

  const [file, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file),
      },uploadFile({ variables: { file } }))));
    }
  });


  // Fetching the image source
  file.map(file => imageSource = file.preview);

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

  if (!imageSource) {
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
        {/* {thumbs} */}
      </div>
    );
  } else {
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
  
        <Canvas image={{ source: imageSource, test: "HEY" }}/>
        {/* {thumbs} */}
      </div>
    );
  }

};
