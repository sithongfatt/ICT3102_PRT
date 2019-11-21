import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Slider, { createSliderWithTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import {
  Card,
  CardBody,
  Row,
  Col
} from "reactstrap";
import { bold } from "ansi-colors";

// Declaring variables
var filename = "";
var imageSource;
var resTitle = "";
// var resTitle = "Please wait while we process your request."

// Slider
const slideStyle = {
  width: "35%",
  marginBottom: 30,
  textAlign: "center",
  marginLeft: "auto",
  marginRight: "auto"
};
const SliderWithTooltip = createSliderWithTooltip(Slider);
const marks = {
  0: {
    style: {
      color: "#FF595E",
      fontWeight: bold,
    },
    label: <strong>0.0(LOW)</strong>
  },
  25: {
    style: {
      color: "#FFFFFF",
      fontWeight: bold,
    },
    label: <strong>0.25</strong>
  },
  50: {
    style: {
      color: "#FFFFFF",
      fontWeight: bold,
    },
    label: <strong>0.5</strong>
  },
  75: {
    style: {
      color: "#FFFFFF",
      fontWeight: bold,
    },
    label: <strong>0.75</strong>
  },
  100: {
    style: {
      color: "#7FFFD4",
      fontWeight: bold,
    },
    label: <strong>1.0(HIGH)</strong>
  }
};
var confidenceLevel = "0.0";
function log(value) {
  value = value / 100;
  confidenceLevel = value.toString();
  console.log(confidenceLevel);
  console.log(typeof confidenceLevel);
}

function percentFormatter(v) {
  return `${v / 100}`;
}

// GraphQL
const uploadFileMutation = gql`
  mutation UploadFile($file: Upload!, $confidence: String!) {
    uploadFile(file: $file, confidence: $confidence)
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
  constructor(props) {
    super(props);
    this.ctx = null;
    this.canvas = null;
    this.img = null;
  }

  drawRectangle(ctx, label, confidence, ax, ay, bx, by) {
    const title = label.toUpperCase() + " " + confidence.slice(0, 5); // To remove after slider
    const w = bx - ax;
    const h = by - ay;

    if (confidence <= 0.5) {
      this.ctx.strokeStyle = "#FF595E";
      this.ctx.fillStyle = "#FF595E";
    } else {
      this.ctx.strokeStyle = "#7FFFD4";
      this.ctx.fillStyle = "#7FFFD4";
    }

    ctx.beginPath();
    ctx.rect(ax, ay, w, h);
    ctx.fillText(title, ax, ay);
    ctx.stroke();
    ctx.closePath();
  }

  componentDidMount() {
    // Render initial drawing here
    this.canvas = this.refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.img = this.refs.image;

    this.img.onload = () => {
      this.canvas.height = this.img.height;
      this.canvas.width = this.img.width;
      this.ctx.drawImage(this.img, 0, 0);
    };
  }

  componentDidUpdate() {
    // Render the draw here
    console.log(this.props.json);
    var yoloResponse = this.props.json;
    console.log(yoloResponse);

    // Start with an empty state
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.img, 0, 0);
    this.ctx.lineWidth = "2";
    this.ctx.strokeWidth = 5;
    this.ctx.shadowBlur = 30;

    this.ctx.strokeStyle = "#7FFFD4";
    this.ctx.shadowColor = "#7FFFD4";
    this.ctx.fillStyle = "#F79A65";
    this.ctx.font = "10px Arial";
    this.ctx.textBaseline = "bottom";
    this.ctx.textAlign = "start";

    for (let i = 0; i < yoloResponse.length; i++) {
      this.drawRectangle(
        this.ctx,
        yoloResponse[i].label,
        yoloResponse[i].confidence,
        yoloResponse[i].topLeft,
        yoloResponse[i].topRight,
        yoloResponse[i].bottomLeft,
        yoloResponse[i].bottomRight
      );
      
      console.log("i=" + i)
      console.log("yoloResponse.length" + (yoloResponse.length - 1))

      if (i === (yoloResponse.length - 1)) {
        resTitle = "FINAL RESULT"
        // this.forceUpdate()
      }
    }
  }


  render() {
    return (
      <Col md="12">
        <Row>
          <Col md="6" className="styleCol">
            <h6>Original</h6>
            <img
              ref="image"
              src={this.props.source}
              className="hidden"
              alt={filename}
            />
          </Col>
          <Col md="6" className="styleCol">
            <h6> {resTitle}</h6>
            {/* <h6>Please wait while we process your request.</h6> */}
            <canvas ref="canvas" />
          </Col>
        </Row>
      </Col>
    );
  }
}

export const Upload = () => {
  resTitle = ""
  const [uploadFile] = useMutation(uploadFileMutation, {
    refetchQueries: [{ query: filesQuery }]
  });

  const [file, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(
            file,
            {
              preview: URL.createObjectURL(file)
            },
            uploadFile({
              variables: { file: file, confidence: confidenceLevel }
            })
          )
        )
      );
    }
  });

  // Fetching the image source
  file.map(file => (imageSource = file.preview));

  const { data, loading } = useQuery(filesQuery);
  console.log("Starting");
  console.log(data);
  console.log(loading);
  console.log(filename);
  console.log(imageSource);

  // Check if there is an image uploaded
  if (!imageSource) {
    resTitle = ""

    // No image uploaded, return default page
    return (
      <div>
        <div style={slideStyle}>
          <SliderWithTooltip
            marks={marks}
            tipFormatter={percentFormatter}
            tipProps={{ overlayClassName: "foo" }}
            onChange={log}
          />
        </div>
        <hr></hr>
        <Card>
          <CardBody>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="paraTitle">Drop the files here ...</p>
              ) : (
                  <p className="paraTitle">
                    Drag & drop image here, or click here to select file.
            </p>
                )}
              {/* <hr></hr> */}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  } else {
    // Image is uploaded, check for yolo response
    if (data != null) {
      // Yolo response is back, check if the file is a new file
      if (data.yoloImage != filename) {
        resTitle = "Please wait while we process your request"
        // File needs to be drawn on
        console.log("I AM GOING TO DRAW");
        console.log(data.yoloResponse);
        // File is a new file needed to be drawn on
        filename = data.yoloImage;
        return (
          <div>
            <div style={slideStyle}>
              <SliderWithTooltip
                marks={marks}
                tipFormatter={percentFormatter}
                tipProps={{ overlayClassName: "foo" }}
                onChange={log}
              />
            </div>
            <hr></hr>
            <Card>
              <CardBody>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="paraTitle">Drop the files here ...</p>
                  ) : (
                      <p className="paraTitle">
                        Drag & drop image here, or click here to select file.
                </p>
                    )}
                  <hr></hr>
                  <Canvas source={imageSource} json={data.yoloResponse} />
                </div>
              </CardBody>
            </Card>
          </div>
        );
      } else {
        resTitle = "FINAL RESULT"
        console.log("no need to draw");
        // File is an existing file that does not need to be drawn on
        return (
          <div>
            <div style={slideStyle}>
              <SliderWithTooltip
                marks={marks}
                tipFormatter={percentFormatter}
                tipProps={{ overlayClassName: "foo" }}
                onChange={log}
              />
            </div>
            <hr></hr>
            <Card>
              <CardBody>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="paraTitle">Drop the files here ...</p>
                  ) : (
                      <p className="paraTitle">
                        Drag & drop image here, or click here to select file.
                </p>
                    )}
                  <hr></hr>
                  <Canvas source={imageSource} json={data.yoloResponse} />
                </div>
              </CardBody>
            </Card>
          </div>
        );
      }

    } else {
      resTitle = "Please wait while we process your request"
      // Image has been uploaded but yolo data is not back
      return (
        <div>
          <div style={slideStyle}>
            <SliderWithTooltip
              marks={marks}
              tipFormatter={percentFormatter}
              tipProps={{ overlayClassName: "foo" }}
              onChange={log}
            />
          </div>
          <hr></hr>
          <Card>
            <CardBody>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="paraTitle">Drop the files here ...</p>
                ) : (
                    <p className="paraTitle">
                      Drag & drop image here, or click here to select file.
              </p>
                  )}
                <hr></hr>
                <Canvas source={imageSource} />
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }
  }
};
