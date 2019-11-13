//Import and initize libary 
const express = require('express');
const app = express();

//import controller file
const imgController = require('./controller/ImageController');

//Initlize a get end point EXAMPLE
app.get('/',imgController.postImage);

//EXPECTED END POINT
app.post('/uploadimage',(req,res) => console.log("TO BE IMPLEMENTED"));

//PORT OF THE SERVER 
app.listen(3000,() => console.log("Listening on port 3000"));



// TO NOTE:
// 1. TO RUN PLEASE RUN COMMAND "node.index.js"
// 2. ALL CONTROLLER FILES WILL BE STORED INSDIE CONTROLLER FOLDER 
// 3. MORE DEPENDENCY TO COME 
// 4. THIS ENTIRE PROJECT FOLDER NOW IS SERVER NOT FRONTEND 
