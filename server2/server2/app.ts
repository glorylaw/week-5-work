import http, { IncomingMessage, Server, ServerResponse } from "http";
const getMetaData = require("metadata-scraper");
/*
implement your server code here
*/

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const matchAdress : IncomingMessage ["url"] | string = req.url;

    //check for condition of method request
    if(matchAdress?.match(/\/api\/([a-z0-9]+)/) && req.method === "GET"){
    
      const testUrl = matchAdress.split("/")[2];
      getMetaData(`https://${testUrl}`).then((metadata : any) =>{
        //destructure the metadata
        const {title, description,image} = metadata;

        //construct the display output
        const outputObj = {
          "Title" : title || "nil",
          "Description" : description || "nil",
          "image" : image || "nil"
        }
        res.writeHead(200,{"Content-Type" : "application/json"});
        res.write(JSON.stringify(outputObj ,null ,2))
        res.end();
      }).catch((error :string) =>{
        console.log(error);
      
      })
    }
    else{
      //bad request handling.
      res.writeHead(404, {"Content-Type": "application/json"});
      res.end("Request not found - invalid url")
    }

    //if (req.method === "GET") {
      //res.end(JSON.stringify({ name: "hello" }));
    //}
  }
);

server.listen(3001);
