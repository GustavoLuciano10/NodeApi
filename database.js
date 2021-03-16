var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message)
      throw err
    }else{
        console.log('Conectado com sucesso ao banco de dados!')
        db.run(`
            CREATE TABLE tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome text, 
            data text,
            descricao text
            )`,(err) => {
        if (err) { }
        else{

        }
    })  
    }
})

module.exports = db

