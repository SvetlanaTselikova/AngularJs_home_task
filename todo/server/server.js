let express=require('express');
let bodyParser = require("body-parser");
let fs=require('fs');
let app=express();
let jsonParser = bodyParser.json();

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.get("/api/todos", function(req, res){
  let data = fs.readFileSync("todos.json", "utf8");
  if(data) {
  let todos = JSON.parse(data);
  res.send(todos);
  }
  else {
    res.send([]);
  }
});

app.post("/api/todos", jsonParser, function (req, res) {
  if(!req.body) return res.sendStatus(400);
  let data = fs.readFileSync("todos.json", "utf8");
  let todos=[];
  if(data) {
    todos = JSON.parse(data);
  }
  if (todos.length>0) id=todos[todos.length-1].id+1;
  else id=1; 
  todo=Object.assign({id:id}, req.body);
  todos.push(todo);
  data = JSON.stringify(todos);
  fs.writeFileSync("todos.json", data);
  res.send(todo);
});

app.delete("/api/todos/:id", function(req, res){
  let id = req.params.id;
  let data = fs.readFileSync("todos.json", "utf8");
  let todos = JSON.parse(data);
  let index = -1;
  for(let i=0; i<todos.length; i++) {
      if(todos[i].id==id) {
          index=i;
          break;
      }
  }
  if(index > -1) {
      todos.splice(index, 1);
      let data = JSON.stringify(todos);
      fs.writeFileSync("todos.json", data);
      res.send(todos);
  }
  else {
      res.status(404).send();
  }
});

app.put("/api/todos/:id", function(req, res){
  let id = req.params.id;
  let data = fs.readFileSync("todos.json", "utf8");
  let todos = JSON.parse(data);
  let index = -1;
  for(let i=0; i<todos.length; i++) {
      if(todos[i].id==id) {
          index=i;
          todos[i].isDone=!Boolean(todos[i].isDone)
          break;
      }
  }
  if(index > -1) {
      let data = JSON.stringify(todos);
      fs.writeFileSync("todos.json", data);
      res.send(todos);
  }
  else {
      res.status(404).send();
  }
});

app.listen(3000, function(){
  console.log("Сервер ожидает подключения...");
});


