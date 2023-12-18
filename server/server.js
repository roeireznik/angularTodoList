const app = require('express')()
const cors = require('cors')
var bodyParser = require('body-parser')
const mysql = require('mysql')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'company'
})
conn.connect();

app.get('/',(req,res)=>{
    conn.query('SELECT customers.name,customers.job,customers.phone,customers.email,tasks.* FROM customers INNER JOIN tasks ON customers.ID = tasks.coustomer_id',(error, results)=>{
        res.json(results)
    })
})
app.post('/addTask',(req,res)=>{
    let today =  new Date()
   let sql = `INSERT INTO tasks (task_description, date, coustomer_id) VALUES ("${req.body.task_description}", "${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}", ${req.body.name})`
    conn.query(sql,(error, results)=>{
        res.json(results)
    })
})
app.post('/addCustomer',(req,res)=>{

   let sql = `INSERT INTO customers (name, job, phone, email) VALUES ("${req.body.name}","${req.body.job}", "${req.body.phone}", "${req.body.email}")`
    conn.query(sql,(error, results)=>{
        res.json(results)
    })
})

app.put('/editCustomer',(req,res)=>{

   let sql = `UPDATE tasks SET task_description = "${req.body.task_description}", coustomer_id = ${req.body.name} ,date = "${req.body.date}", is_done = ${req.body.is_done} WHERE ID = ${req.body.ID}  `
    conn.query(sql,(error, results)=>{
        res.json(results)
    })
})

app.get('/customers',(req,res)=>{
    conn.query('SELECT * FROM customers',(error, results)=>{
        res.json(results)
    })
})

app.delete('/deleteTask',(req,res)=>{
    conn.query('DELETE FROM tasks WHERE ID =' + req.query.id,(error, results)=>{
        res.json(results)
    })
})
app.delete('/deleteCustomer',(req,res)=>{
    conn.query('DELETE FROM customers WHERE ID =' + req.query.id,(error, results)=>{
        res.json(results)
    })
})

app.put('/isDone',(req,res)=>{
    conn.query(`UPDATE tasks SET is_done = ${req.query.done} WHERE ID = ${req.query.id}`,(error, results)=>{
        res.json(results)
    })
})

app.listen(3030,console.log('listening to 3030'))