const express=require("express")
const app=express()

// declare required dependencies  
const path=require("path")
const http=require("http")
const {Server}=require("socket.io")


const server=http.createServer(app) //create server in HTTP

const io=new Server(server)
app.use(express.static(path.resolve(""))) // to successfully use app constant, indicate path of HTML file

app.get("/",(req,res)=>{
  return res.sendFile("index.html")
})

server.listen(3000,()=>{
  console.log("port connected to 3000")
})