var express = require("express")
var app = express()
var cors = require('cors')
var db = require("./database.js")

app.use(cors())
app.use(express.static('public'))

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var HTTP_PORT = 3000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/todos", (req, res, next) => {
    var sql = "select * from todos"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "todos":rows
        })
      });
});


app.get("/api/todos/:id", (req, res, next) => {
    var sql = "select * from todos where todosId = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "todos":row
        })
      });
});


app.post("/api/todos/", (req, res, next) => {
    var errors=[]
    var data = {
        todosTitel: req.body.todosTitel,
        todosInnehåll: req.body.todosInnehåll,
        todosSkapadAv: req.body.todosSkapadAv
    }
    var sql ='INSERT INTO todos (todosTitel, todosInnehåll, todosSkapadAv) VALUES (?,?,?)'
    var params =[data.todosTitel, data.todosInnehåll, data.todosSkapadAv]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "todos": data,
            "id" : this.lastID
        })
    });
})

app.put("/api/todos/:id", (req, res, next) => {
    var data = {
        todosTitel: req.body.todosTitel,
        todosInnehåll: req.body.todosInnehåll,
        todosSkapadAv: req.body.todosSkapadAv
    }
    var sql ='UPDATE todos SET todosTitel = ?, todosInnehåll = ?, todosSkapadAv = ? WHERE bokId = ?'
    var params =[data.todosTitel, data.todosInnehåll, data.todosSkapadAv, req.params.id]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "todos": data,
            "id" : this.lastID
        })
    });
})

app.delete("/api/todos/:id", (req, res, next) => {
    db.run(
        'DELETE FROM todos WHERE todosId = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", rows: this.changes})
    });
})

// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

