const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const db = require('../db');

// Instanciranje rutera
const route = express.Router();

// Sema za validaciju
const sema = Joi.object().keys({
    post_code: Joi.string().trim().min(5).max(5).required(),
    city: Joi.string().trim().max(50).required(),
    country: Joi.string().trim().max(50).required(),
});

// Koristi JSON Middleware za parsiranje requestova
route.use(express.json());

// Lista svih gradova
route.get('/', (req, res) => {
    db.query('select * from sys_city', (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

// Prikaz pojedinacnog grada
route.get('/:id', (req, res) => {
    let query = 'select * from sys_city where id=?;';
    let formatted = mysql.format(query, [req.params.id]);

    db.query(formatted, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else if (rows.length === 0)
            res.status(404).send('city not found');
        else
            res.send(rows[0]);
    });
});

// Kreiranje novog grada
route.post('/', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje error-a
    let { error } = Joi.validate(req.body, sema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        // SQL query
        let query = "insert into sys_city (post_code, city, country) values (?, ?, ?);";
        let formatted = mysql.format(query, [
            req.body.post_code,
            req.body.city,
            req.body.country,
        ]);

        db.query(formatted, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske, vracamo kreirani objekat
                query = 'select * from sys_city where id=?;'
                formatted = mysql.format(query, [response.insertId]);

                db.query(formatted, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

// Azuriranje grada
route.put('/:id', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje unosa
    let { error } = Joi.validate(req.body, sema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        // SQL query
        let query = "update sys_city set post_code=?, city=?, country=? where id=?;";
        let formatted = mysql.format(query, [
            req.body.post_code,
            req.body.city,
            req.body.country,
            req.params.id
        ]);

        db.query(formatted, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske, vracamo kreirani objekat
                query = 'select * from sys_city where id=?;'
                formatted = mysql.format(query, [req.params.id]);

                db.query(formatted, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

// Brisanje grada
route.delete('/:id', (req, res) => {
    let query = 'select * from sys_city where id=?;';
    let formatted = mysql.format(query, [req.params.id]);

    db.query(formatted, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else if (rows.length === 0)
            res.status(404).send("city not found");
        else {
            let city = rows[0];

            let query = 'delete from sys_city where id=?';
            let formatted = mysql.format(query, [req.params.id]);

            db.query(formatted, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(city);
            });
        }
    });
});

module.exports = route;
