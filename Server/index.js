//Import and initize libary 
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const fetch = require('node-fetch');

const { ApolloServer, gql } = require("apollo-server-express");
const { createWriteStream, existsSync, mkdirSync } = require("fs");
const path = require("path");

const bytesarray = [];
var body;
var image = "";
var label = "";


const apiLink = 'http://192.168.99.100:5000/getYolo';
const typeDefs = gql`
  type Query {
    yoloImage: String!
    yoloLabel: String!
  }

  type Mutation {
    uploadFile(file: Upload!): Boolean
  }
`;

const resolvers = {
  Query: {
    yoloImage: () => image,
    yoloLabel: () => label
  },
  Mutation: {
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename } = await file;






      // if (files.length > 0) {
      //     console.log("I'm here");
      //     console.log(path.join(__dirname, "./images", files[0]));   
      //     // fs.unlinkSync(path.join(__dirname, "./images", files[0].filename)); 
      // }
      // Portion to break files into Bytes array and pass to YOLO for response
      console.log("First");
      await new Promise(res =>
        createReadStream()
          .on("data", (chunk) => bytesarray.push(chunk))
          // Uncomment below for writing of image
          //   .pipe(createWriteStream(path.join(__dirname, "./images", filename)))
          .on("close", res)
      );

      console.log("done");
      console.log(bytesarray);
      console.log(bytesarray.length);
      body = Buffer.concat(bytesarray)
      // Array Format to test with YOLO
      console.log(typeof (body));
      console.log(body);
      console.log(body.length);
      //getYolo
      // var json = {
      //   "yolo": body,
      // }
      // console.log("CALLING FLASK");

      // fetch(apiLink, {
      //   method: 'post',
      //   body: JSON.stringify(json),
      //   headers: { 'Content-Type': 'application/json' },
      // })
      //   .then(res => res)
      //   .then(json => console.log(json))
      //   .catch(err => console.log(err));
      console.log("=========Converting============");
      // JSON Format to test with YOLO
      body = body.toJSON();
      //getYolo
      var json = {
        "yolo": body.data,
      }
      console.log(json);
      await fetch(apiLink, {
        method: 'post',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));




      console.log(body.toJSON());
      console.log(typeof (body));
      console.log(body);
      console.log(body.length);
      console.log(file);
      // Use Body as an argument to the YOLO request, update variables with YOLO response

      //-------------------- NEW CODE ADDED ------------------------ 


      // console.log("json format for flask");
      // console.log(  );
      image = filename;
      label = "Truck";

      return true;
    }
  }
};

existsSync(path.join(__dirname, "./images")) || mkdirSync(path.join(__dirname, "./images"));

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
// const imgController = require('./controller/ImageController');

//Initlize a get end point EXAMPLE
// app.get('/',imgController.postImage);
//import controller file

// Middleware for GraphQL
// app.use('/graphql', graphqlHTTP({
//     schema,
//     graphiql: true
// }));

app.use("/images", express.static(path.join(__dirname, "./images")));
server.applyMiddleware({ app });



//PORT OF THE SERVER 
app.listen(4000, () => console.log("Listening on port 4000"));

