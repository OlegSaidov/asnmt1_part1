//copyright-2018, Oleg Saidov, Website Engineering Course, Professor Alfred Rezk

//import modules fs, http, and path
const http = require("http");
const fs   = require("fs");
const path = require("path");

//define a port variable
var port = 4000;

//define mimeTypes object
var mimeTypes =  {
    ".html":"text/html",
    ".jpeg":"image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".js":"text/javascript",
    ".css":"text/css"
    }; // mimeTypes object

//create a server
var server = http.createServer(function(req, res){

    //get the url of the client request 
    var requestUrl = req.url;

    //get the basename of the url
    var baseName = path.basename(requestUrl);
    
    //get the extension name of the url
    var extName = path.extname(requestUrl);

    //get the mimeType of the file based on extName

    var mimeType = mimeTypes[extName];

    //create a filepath of the file requested in the url

    var fileName = path.join(process.cwd(), requestUrl);

    //check if the file in refered in requestUrl actually exists in the server

    fs.exists(fileName, function(exists){
            if(exists){//if exists is true
                                             //if exists is true, check the file stats
                                             fs.stat(fileName,function(error, stats){
                                                            //catch error
                                                            if(error) throw error;
                                                            
                                                            //if no error check if is file
                                                            if(stats.isFile()){ //is file
                                                                //if file exists and is a file, read it and send the reponse to the client
                                                                 fs.readFile(fileName,function(error, data){
                                                                    //check if no error while reading the file
                                                                    if(error) throw error;

                                                                    //otherwise send data to the client
                                                                    res.writeHead(200, {"Content-Type": mimeType});
                                                                    res.write(data);
                                                                    res.end();

                                                                 });//readFile   

                                                            }else if(stats.isDirectory()){ //is direcory
                                                                //if the the url points to a directory, for now display 404
                                                                res.writeHead(404, {"Content-Type":"text/plain"});
                                                                res.write("You're requesting a directory and not a file,it is not found, please enter the correct url.");
                                                                res.end();

                                                            }else {
                                                                   // Tell the client, there is a server error
                                                                   res.writeHead(500, {"Content-Type":"text/plain"});
                                                                   res.write("Something is wrong, the server is in error state.");
                                                                   res.end();

                                                            }//stats if/else if /else

                                             })// fs.stat
                                            
            }else{// if exists is false
                                            //if exists is false, display 404 file not found message
                                            res.writeHead(404, {"Content-Type":"text/plain"});
                                            res.write("File not found, please endter the correct url.");
                                            res.end();
            }//end if/else fileName exists

    }); //fs.exists

    // Test to be removed before deployment
console.log("The requrest url is:" + requestUrl);
console.log("The basename is: " + baseName);
console.log("The extension name is: " + extName);
console.log("The mime-type is: " + mimeType);
console.log("The filename is: " + fileName);
// End of test lines

});// createServer



server.listen(port);

