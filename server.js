var express = require("express")
var app = express()
var db = require("./database.js")
var cors = require('cors');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/tarefas", (req, res, next) => {
    var sql = "select * from tarefas"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});


app.get("/api/tarefa/:id", (req, res, next) => {
    var sql = "select * from tarefas where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});


app.post("/api/tarefa/", (req, res, next) => {
    var errors=[]
    if (!req.body.nome){
        errors.push("O campo nome não pode ser nulo");
    }
    if (!req.body.data){
        errors.push("O campo data não pode ser nulo");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        nome: req.body.nome,
        data: req.body.data,
        descricao : req.body.descricao
    }
    var sql ='INSERT INTO tarefas (nome, data, descricao) VALUES (?,?,?)'
    var params =[data.nome, data.data, data.descricao]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})



app.patch("/api/tarefas/:id", (req, res, next) => {
    var data = {
        nome: req.body.nome,
        data: req.body.data,
        descricao: req.body.descricao
    }
    db.run(
        `UPDATE tarefas set 
           nome = coalesce(?,nome), 
           data = COALESCE(?,data), 
           descricao = coalesce(?,descricao) 
           WHERE id = ?`,
        [data.nome, data.data, data.descricao, req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data
            })
    });
})


app.delete("/api/tarefas/:id", (req, res, next) => {
    db.run(
        'DELETE FROM tarefas WHERE id = ?',
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

