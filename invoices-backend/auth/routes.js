const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('njwt');
const auth = require('./authorization')
const mysql = require('mysql');
const db = require('../database/connect');
const settings = require('../settings.json');

const saltRounds = 10;

// Instanciranje rutera
const route = express.Router();

// Seme za validaciju
const loginSema = Joi.object().keys({
    username: Joi.string().trim().max(30).required(),
    password: Joi.string().trim().min(6).required(),
});

const registerSema = Joi.object().keys({
    username: Joi.string().trim().max(30).required(),
    password: Joi.string().trim().min(6).required(),
    email: Joi.string().trim().max(50).required(),
    name: Joi.string().trim().max(30).required(),
    surname: Joi.string().trim().max(30).required(),
});

// Koristi JSON Middleware za parsiranje requestova
route.use(express.json());

// Logovanje korisnika
route.post('/login', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje error-a
    let { error } = Joi.validate(req.body, loginSema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        // SQL query
        let query = "select * from sys_user where username=?;";
        let formatted = mysql.format(query, [
            req.body.username
        ]);

        db.query(formatted, (err, rows) => {
            if (err) {
                // Greska servera
                console.log("auth failed: " + err.sqlMessage);
                res.status(500).send('authentication failed');
            } else if (rows.length === 0) {
                res.set("WWW-Authenticate", 'Basic realm="Access to invoices requires login"');
                res.status(401).send('Unauthorized: incorrect username or password');
            } else {
                let user = rows[0];
                if(!user.is_active) {
                    res.set("WWW-Authenticate", 'Basic realm="Access to invoices requires login"');
                    res.status(401).send('Unauthorized');
                }

                bcrypt.compare(req.body.password, user.password)
                    .then(result => {
                        if (result === false) {
                            res.set("WWW-Authenticate", 'Basic realm="Access to invoices requires login"');
                            res.status(401).send('Unauthorized: incorrect username or password');
                        } else {
                            const claims = {
                                iss: 'invoices',
                                sub: user.id,
                                user: user.username,
                                name: user.name,
                                surname: user.surname,
                                admin: user.is_admin
                            }
                            const token = jwt.create(claims, settings.jwt_secret);
                            token.setExpiration(new Date().getTime() + 60*60*24*1000) // 1 day
                            res.set("Authorization", "Basic " + token.compact());
                            res.status(204).send('');
                        }
                    });
            }
        });
    }
});

// Registracija korisnika
route.post('/register', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje error-a
    let { error } = Joi.validate(req.body, registerSema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        bcrypt.hash(req.body.password, saltRounds)
            .then(hash => {
                // SQL query
                let query = "insert into sys_user (username, password, email, name, surname) values (?, ?, ?, ?, ?);";
                let formatted = mysql.format(query, [
                    req.body.username,
                    hash,
                    req.body.email,
                    req.body.name,
                    req.body.surname
                ]);

                db.query(formatted, (err, response) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else {
                        // Ako nema greske, vracamo kreirani objekat
                        query = 'select id, username, email, name, surname, is_admin, is_active from sys_user where id=?;'
                        formatted = mysql.format(query, [response.insertId]);

                        db.query(formatted, (err, rows) => {
                            if (err)
                                res.status(500).send(err.sqlMessage);
                            else
                                res.send(rows[0]);
                        });
                    }
                });
            });
    }
});

// Detalji naloga
route.get('/account', auth.isAuthorizedUser, (req, res) => {
    const token = req.header("Authorization").split("Basic ")[1];

    jwt.verify(token, settings.jwt_secret, (err, verifiedJwt) => {
        if (err)
            res.status(400).send('invalid jwt token');
        else {
            // SQL query
            let user_id = verifiedJwt.body.sub;
            let query = 'select id, username, email, name, surname, is_admin, is_active from sys_user where id=?;';
            let formatted = mysql.format(query, [user_id]);

            db.query(formatted, (err, rows) => {
                if (err)
                    // Greska servera
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(rows[0]);
            });
        }
    })
});

// Azuriranje naloga
route.put('/account', auth.isAuthorizedUser, (req, res) => {
    const token = req.header("Authorization").split("Basic ")[1];

    jwt.verify(token, settings.jwt_secret, (err, verifiedJwt) => {
        updateAccount(req, res, verifiedJwt.body.sub);
    });
});

route.put('/account/:id', auth.isAuthorizedAdmin, (req, res) => {
    updateAccount(req, res, req.params.id);
});

function updateAccount(req, res, id) {
    // Validacija unosa
    // Object decomposition - dohvatanje unosa
    let { error } = Joi.validate(req.body, registerSema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        bcrypt.hash(req.body.password, saltRounds)
            .then(hash => {
                // SQL query
                let query = "update sys_user set username=?, password=?, email=?, name=?, surname=? where id=?;";
                let formatted = mysql.format(query, [
                    req.body.username,
                    hash,
                    req.body.email,
                    req.body.name,
                    req.body.surname,
                    id
                ]);

                db.query(formatted, (err, response) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else if (response.affectedRows === 0)
                        res.status(404).send("user not found");
                    else {
                        // Ako nema greske, vracamo kreirani objekat
                        query = 'select id, username, email, name, surname, is_admin, is_active from sys_user where id=?;'
                        formatted = mysql.format(query, [id]);

                        db.query(formatted, (err, rows) => {
                            if (err)
                                res.status(500).send(err.sqlMessage);
                            else
                                res.send(rows[0]);
                        });
                    }
                });
            });
    }
}

// Brisanje naloga
route.delete('/account/:id', auth.isAuthorizedAdmin, (req, res) => {
    // SQL query
    let query = "update sys_user set is_active=0 where id=?;";
    let formatted = mysql.format(query, [req.params.id]);

    db.query(formatted, (err, response) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else if (response.affectedRows === 0)
            res.status(404).send("user not found");
        else {
            // Ako nema greske, vracamo kreirani objekat
            query = 'select * from sys_user where id=?;'
            formatted = mysql.format(query, [req.params.id]);

            db.query(formatted, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(rows[0]);
            });
        }
    });
});

module.exports = route;
