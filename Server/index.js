// Import and initize libary 
const express = require('express');
const fetch = require('node-fetch');
const { ApolloServer, gql } = require("apollo-server-express");
const { existsSync, mkdirSync } = require("fs");
const path = require("path");
const bodyParser = require('body-parser')

const bytesArray = [];
var bytesBody;
var image = "";
var yoloResult;
var yoloArray = [];

const apiLink = 'http://yolo:5000/getYolo';

// Type Defs and Resolvers for GraphQL
const typeDefs = gql`
  type Query {
    yoloImage: String!
    yoloResponse: [Yolo!]
  }

  type Yolo {
    label: String!
    confidence: String!
    topLeft: String!
    topRight: String!
    bottomLeft: String!
    bottomRight: String!
  }

  type Mutation {
    uploadFile(file: Upload!): Boolean
  }
`;

const resolvers = {
  Query: {
    yoloImage: () => image,
    yoloResponse: () => yoloArray
  },
  Mutation: {
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename } = await file;
      // Clear the arrays for fresh start
      bytesArray.length = 0;
      yoloArray.length = 0;

      // Portion to break files into Bytes array and pass to YOLO for response
      await new Promise(res =>
        createReadStream()
          .on("data", (chunk) => bytesArray.push(chunk))
          .on("close", res)
      );

      // Concatenate all the bytes array and convert into JSON
      bytesBody = Buffer.concat(bytesArray)
      bytesBody = bytesBody.toJSON();
      var bytesBodyJson = {
        "yolo": bytesBody.data,
      }

      // Execute API getYolo
      await fetch(apiLink, {
        method: 'post',
        body: JSON.stringify(bytesBodyJson),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(responseData => yoloResult = JSON.parse(responseData.replace(/[']+/g, '\"')))
        .then(clearArray => yoloArray.length = 0)
        .catch(err => console.log(err));

      // Filtering yoloResult into GraphQL Response
      for (yolo of yoloResult) {
        yoloArray.push(
          new Yolo(yolo.label,
            yolo.confidence,
            yolo.topleft.x,
            yolo.topleft.y,
            yolo.bottomright.x,
            yolo.bottomright.y));
      }
      image = filename;

      return true;
    }
  }
};

// This class implements the Yolo GraphQL type
class Yolo {
  constructor(label, confidence, topLeft, topRight, bottomLeft, bottomRight) {
    this.label = label;
    this.confidence = confidence;
    this.topLeft = topLeft;
    this.topRight = topRight;
    this.bottomLeft = bottomLeft;
    this.bottomRight = bottomRight;
  }
}

existsSync(path.join(__dirname, "./images")) || mkdirSync(path.join(__dirname, "./images"));

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));
app.use("/images", express.static(path.join(__dirname, "./images")));
server.applyMiddleware({ app });

//PORT OF THE SERVER 
app.listen(4000, () => console.log("Listening on port 4000"));