
const express = require('express');

const mysql2 = require('mysql2');

const DBConfig=require('./dbConfig');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());


const db = mysql2.createConnection({

    host:'localhost',
    user: 'root',
    password:'root',
    database:'api',
    port: 3306

});

db.connect((err) => {

    if (err) {
        console.log("Error Connecting DB");
    } else {
        console.log("Connection Success");
    }

})


app.get('/getAll', (req, res) => {

    db.query('select * from student', (err, result) => {
        if (err) {
            res.send({ message: "Error getting student" });
        } else {
            res.send(result);
        }
    })

});






app.post('/post', (req, res) => {
    const { name, email, phone, address } = req.body;

    
    if (name && email && phone && address) {

       
        db.query(`SELECT * FROM student WHERE email = ? OR phone = ?`, [email, phone], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: "Database query error" });
            }

            
            if (result.length > 0) {
                
                return res.status(200).send({ message: "User Already Exists" });
            }

            
            db.query("INSERT INTO student (name, email, phone, address) VALUES (?, ?, ?, ?)", [name, email, phone, address], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ message: "Error inserting student" });
                }

                
                res.status(200).send({ message: "Registration Success" });
            });
        });

    } else {
        
        res.status(400).send({ message: "Please fill all the fields" });
    }
});


app.get("/getbyEmail/:email/:address", (req, res) => {
    const { email, address } = req.params;
  
    const sql= `SELECT * FROM student WHERE email = ? AND address = ?`;
    db.query(sql, [email, address], (err, result, field) => {
      if (err) {
        res.send({ message: "Error getting student" });
      } else if (result.length===0) {
        res.send(false);
      } else {
        res.send(result);
      }
    });
  });



app.listen(3000, () => {
    console.log("App listening port:3000");

});




