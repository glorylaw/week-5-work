import http, { IncomingMessage, Server, ServerResponse } from "http";
import fs from "fs"
import path from "path"
import dotenv from "dotenv"
dotenv.config()
const dataBase  = require( path.join(__dirname,"../database.json"))
// console.log(dataBase)
/*
implement your server code here
*/

const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  function fileSystem(file: any){
    fs.writeFile("./database.json",JSON.stringify(file),"utf8",(err) =>{
      if(err)throw  err;
        console.log("file has been created") 
    });
  }
    if (req.method === "GET" && req.url === "/getEverything")  {
      
      res.end(JSON.stringify(dataBase));
    }
    if(req.method ==="POST" && req.url === "/addPost"){
        req.on("data",(data)=>{
          //console.log(data)
          const postRequest = JSON.parse(data.toString())
          dataBase.push(postRequest)
          fileSystem(dataBase)
        });
        
        res.end(JSON.stringify({name:"Glory"}))
    }

    if(req.method === "PUT" && req.url === "/updateData"){
      req.on("data",(data)=>{
        const {id} = JSON.parse(data.toString())
        let incoming =JSON.parse(data.toString())
        //console.log(id)
        let newArray = Array.from(dataBase)
        //let dataFiltered = newArray.filter((item:any)=>{item.id != id})
       // console.log(dataFiltered)
       let modifil:any  = newArray.filter((d:any)=>(d.id == id))[0]
       let update:any = {}
       
       update.organization = incoming.organization?incoming.organization:modifil.country
       update.createdAt = new Date()
       update.updatedAt = incoming.updatedAt?incoming.updatedAt:modifil.updatedAt
       update.products = incoming.products?incoming.products:modifil.products 
       update.marketValue = incoming.marketValue?incoming.marketValue:modifil.marketValue
       update.adress = incoming.address?incoming.address:modifil.address
       update.ceo = incoming.ceo?incoming.ceo:modifil.ceo
       update.country = incoming.country?incoming.country:modifil.country
       update.id = modifil.id
       update.noOfEmployees = incoming.noOfEmployees?incoming.noOfEmployees:modifil.noOfEmployees
       update.employees = incoming.employees?incoming.employees:modifil.employees
        
       let mapData = dataBase.map((item:any)=>item.id === id ?update:item)
       fileSystem(mapData)
       //console.log(mapData)

      });
      res.end("update data")
    }

    if(req.method === "DELETE" && req.url === "/removeData"){
      req.on("data",(dataID) => {
        const { id } = JSON.parse(dataID.toString());
        let newData =Array.from(dataBase);
        let deletedId = newData.filter((element:any) => element.id !=id);
        //console.log(deletedId)
        fileSystem(deletedId);
      });
      
      res.end("remove data");
    }
  }

);

server.listen(process.env.PORT,()=>{
  console.log(`running on port ${process.env.PORT}`)
});
