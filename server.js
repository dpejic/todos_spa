const express = require("express");
const mongojs = require("mongojs");

const db = mongojs("mojadb", ["todos"]);

const app = express();
app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.post("/save", (req, res) => {
    let msg = req.body.message;
    db.todos.insert({msg: msg, date: new Date().toDateString()}, (err, data) => {
        res.send("Sve ok"); 
    });
});

app.get("/get_data", (req, res) =>{
    db.todos.find((err, data) => {
        res.send(data);
    })
});

app.post("/delete", (req, res) =>{
    let id = req.body.id;
    console.log(id);
    db.todos.remove({ "_id": db.ObjectId(id)}, (err, data) => {
        res.send("deleted");
    })
});

app.listen(3000, () => {
    console.log("Listening to port 3000...");
})