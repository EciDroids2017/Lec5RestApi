const { Pool, Client } = require("pg");
var express = require("express");
//var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");

//new express app - simillar to constructor:
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

const pool = new Pool({
    user: "betozeqtwthohb",
    host: "ec2-107-20-224-137.compute-1.amazonaws.com",
    database: "d1h178jjl1iruf",
    password: "d75fac88f5db8c650f90a36c41231da3322cbe7cbdfc443e81326367393886a1",
    port: 5432
});

app.get("/initdb", (req, res) => {
    //multi line string: ES6
    const sql = `CREATE TABLE Expenses(id SERIAL, 
        amount TEXT, category TEXT, date TEXT, description TEXT)`;
    //amount, category, date description
    pool.query(sql, [], (err, dbResponse) => {
        if (err) {
            return res.json(err);
        }
        //if  we got so far: we have a table!
        //present the db response:
        res.json({ Response: dbResponse });
    });
});

app.get("/expenses", (req, res) => {
    const sql = `SELECT * FROM expenses`;

    pool.query(sql, [], (err, dbResponse) => {
        if (err) {
            return res.json(err);
        }
        res.json({ Expenses: dbResponse.rows });
    });
});

app.post("/expenses", (req, res) => {
    const amount = req.body.amount;
    const category = req.body.category;
    const date = req.body.date;
    const description = req.body.description;

    const sql = `INSERT INTO
     expenses(amount, category, date, description)
     VALUES($1, $2, $3, $4)`;
    //amount, category, date description
    pool.query(sql, [amount, category, date, description], (err, dbResponse) => {
        if (err) {
            return res.json(err);
        }
        res.json({ Response: dbResponse });
    });
});

//get expense by id:
app.get("/expenses/:id", function(req, res) {
    const id = req.params.id;
    if (!id) {
        return res.json({ error: "no id" });
    }
    const sql = `SELECT * FROM expenses WHERE ID = $1`;
    pool.query(sql, [id], (err, dbResponse) => {
        if (err) {
            return res.json(err);
        }

        res.json({ Expense: dbResponse.rows[0] });
    });
});

//delete expense by id:
app.delete("/expenses/:id", function(req, res) {
    const id = req.params.id;
    if (!id) {
        return res.json({ error: "no id" });
    }
    const sql = `DELETE FROM expenses WHERE ID = $1`;
    pool.query(sql, [id], (err, dbResponse) => {
        if (err) {
            return res.json(err);
        }

        res.json(dbResponse);
    });
});

app.put("/expenses/:id", (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.json({ error: "no id" });
    }

    const amount = req.body.amount;
    const category = req.body.category;
    const date = req.body.date;
    const description = req.body.description;

    const sql = `UPDATE expenses set
    amount = $1, category = $2, date = $3, description = $4 
                 WHERE id = $5`;
    //amount, category, date description
    pool.query(
        sql, [amount, category, date, description, id],
        (err, dbResponse) => {
            if (err) {
                return res.json(err);
            }
            res.json({ result: dbResponse });
        }
    );
});

app.get("/", function(req, res) {
    res.redirect("/expenses");
});

app.listen(process.env.PORT || 3000);