const express = require('express');
const mysql = require("mysql");
const path = require("path");
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDir = path.join(__dirname, './public');

app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: 'false' }));
app.use(express.json());
app.use(express({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'hbs');

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MySQL connected!");
    }
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/platformer", (req, res) => {
    if (req.session.loggedin) {
        res.render("platformer");
    } else {
        res.redirect("/login");
    }
});

app.get("/dragAndDrop", (req, res) => {
    if (req.session.loggedin) {
        res.render("dragAndDrop");
    } else {
        res.redirect("/login");
    }
});

app.post("/auth/register", (req, res) => {
    const { name, email, password, password_confirm } = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }
        if (result.length > 0) {
            return res.render('register', {
                message: 'This email is already being used. Try logging in instead'
            });
        } else if (password !== password_confirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        res.redirect('/login');
        console.log(hashedPassword);
    });
});

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
            if (result.length == 0 || !(await bcrypt.compare(password, result[0].password))) {
                res.render('login', {
                    message: 'Invalid email or password'
                });
            } else {
                req.session.loggedin = true;
                req.session.email = email;
                req.session.password = password;
                res.redirect('/platformer');
            }
        });
    } else {
        res.render('login', {
            message: 'Please enter both email and password'
        });
    }
});


app.post('/game', (req, res) => {
    const { score } = req.body;
    const email = req.session.email;

    res.send(`Score ${score} recorded for user ${email}`);
});


app.listen(5000, () => {
    console.log("server started on port 5000")
})