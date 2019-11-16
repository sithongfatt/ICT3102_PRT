const graphql = require('graphql');
const _ = require('lodash');

// Importing GraphQL packages
const { 
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLList,
    GraphQLString,
    GraphQLSchema 
} = graphql;

// Dummy data
var responses = [
    {image: '1', label: "Truck", topLeft: "40", topRight: "56", bottomLeft: "72", bottomRight: "73"},
    {image: '2', label: "Car", topLeft: "36", topRight: "62", bottomLeft: "123", bottomRight: "161"},
    {image: '3', label: "Bus", topLeft: "27", topRight: "58", bottomLeft: "219", bottomRight: "165"}
];

// Model for GraphQL
const YOLOType = new GraphQLObjectType({
    name: 'Yolo',
    fields: () => ({
        image: { type: GraphQLString},
        label: { type: GraphQLString},
        topLeft: { type: GraphQLString},
        topRight: { type: GraphQLString},
        bottomLeft: { type: GraphQLString},
        bottomRight: { type: GraphQLString},
    })
});

// Root Query => How to jump into the graph
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        yolo: { // Front end to query 
            type: YOLOType, 
            args: {image: {type:GraphQLString}}, // Query with argument
            resolve(parent,args) {
                // Code to get data from database or other source
                return _.find(responses, { image: args.image});
            }
        },
        yolos: {
            type: new GraphQLList(YOLOType),
            resolve(parent, args){
                return responses;
            }
        }
    }
})

// Creating the Schema and passing in the queries to expose
module.exports = new GraphQLSchema({
    query: RootQuery
});