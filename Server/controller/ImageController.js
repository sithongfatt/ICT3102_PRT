//expose all the controller function to the index.js
module.exports = {
    // FOR ROUTE '/' 
    postImage : function(req,res){
        //SEND RESPONSE TO VIEW 
        res.send("HELLO WORLD123");
    }
}