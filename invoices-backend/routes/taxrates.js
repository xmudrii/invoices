const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const db = require('../database/connect');

// Instanciranje rutera
const route = express.Router();

// Sema za validaciju
const sema = Joi.object().keys({
    name: Joi.string().trim().max(15).required(),
    value: Joi.number().precision(2).required(),
});

// Koristi JSON Middleware za parsiranje requestova
route.use(express.json());

// Lista svih poreskih stopa
route.get('/', (req, res) => {
    db.query('select * from sys_tax_rate', (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

// Prikaz pojedinacke poreske stope
route.get('/:id', (req, res) => {
    if(isNaN(req.params.id)) {
        res.status(400).send('id must be a number');
        return;
    }

    let query = 'select * from sys_tax_rate where id=?;';
    let formatted = mysql.format(query, [req.params.id]);

    db.query(formatted, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else if (rows.length === 0)
            res.status(404).send('tax rate not found');
        else
            res.send(rows[0]);
    });
});

// Kreiranje nove poreske stope
route.post('/', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje error-a
    let { error } = Joi.validate(req.body, sema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        // SQL query
        let query = "insert into sys_tax_rate (name, value) values (?, ?);";
        let formatted = mysql.format(query, [
            req.body.name,
            req.body.value
        ]);

        db.query(formatted, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske, vracamo kreirani objekat
                query = 'select * from sys_tax_rate where id=?;'
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

// Azuriranje poreske stope
route.put('/:id', (req, res) => {
    // Validacija unosa
    if(isNaN(req.params.id)) {
        res.status(400).send('id must be a number');
        return;
    }
    // Object decomposition - dohvatanje unosa
    let { error } = Joi.validate(req.body, sema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        // SQL query
        let query = "update sys_tax_rate set name=?, value=? where id=?;";
        let formatted = mysql.format(query, [
            req.body.name,
            req.body.value,
            req.params.id
        ]);

        db.query(formatted, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else if (response.affectedRows === 0)
                res.status(404).send("tax rate not found");
            else {
                // Ako nema greske, vracamo kreirani objekat
                query = 'select * from sys_tax_rate where id=?;'
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

// Brisanje poreske stope
route.delete('/:id', (req, res) => {
    if(isNaN(req.params.id)) {
        res.status(400).send('id must be a number');
        return;
    }

    let query = 'select * from sys_tax_rate where id=?;';
    let formatted = mysql.format(query, [req.params.id]);

    db.query(formatted, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else if (rows.length === 0)
            res.status(404).send("tax rate not found");
        else {
            let city = rows[0];

            let query = 'delete from sys_tax_rate where id=?';
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
