const express=require("express");
const app=express();

// declare required dependencies  
const path=require("path")
const http=require("http");
const {Server}=require("socket.io");


const server=http.createServer(app); //create server in HTTP


const io=new Server(server);

app.use(express.static(path.resolve(""))) // to successfully use app constant, indicate path of HTML file

let arr=[]
let playingArray=[]

io.on("connection",(socket)=>{ // to get the name of the user
  socket.on("find",(e)=>{
    if(e.name!=null){ // e is the event object to check if name is null
     
      arr.push(e.name)

      if(arr.length>=2){ //letter of name must be more than 2
        let p1obj={
          p1name:arr[0], // first player will be first element in array
          p1value:"X", // first player will be X
          p1move:"" // shows which button player has clicked to indicate afterwards
        }
        let p2obj={
          p2name:arr[1], // second player will be second element in array
          p2value:"O", // second player will be O
          p2move:"" // shows which button player has clicked to indicate afterwards
        }

        let obj={ // let object obj act as container for two properties p1 and p2
          p1:p1obj, // p1 references p1obj
          p2: p2obj,
          sum:1
        }
        playingArray.push(obj) // to add object to end of playing array to show who is playing

        arr.splice(0,2) // removes elements starting from index 0

        io.emit("find",{allPlayers:playingArray}) // sends object as event payload to socket.io which contains property allPlayers
        // sends data to the server which can then be processed by server
      }
    }
  })

  socket.on("playing",(e)=>{
    if(e.value=="X"){
      let objToChange=playingArray.find(obj=>obj.p1.p1name===e.name)

      objToChange.p1.p1move=e.id 
      objToChange.sum++
    }

    else if(e.value=="O"){
      let objToChange=playingArray.find(obj=>obj.p2.p2name===e.name)

      objToChange.p2.p2move=e.id 
      objToChange.sum++
    }

    io.emit("playing",{allPlayers:playingArray})
  })

  socket.on("gameOver",(e)=>{ // after game is over, array for two players will be deleted
    playingArray=playingArray.filter(obj=>obj.p1.p1name!==e.name)
    console.log(playingArray)
  })
})

app.get("/",(req,res)=>{
  return res.sendFile("index.html");
});

server.listen(3000,()=>{
  console.log("port connected to 3000"); // nodemon index
});