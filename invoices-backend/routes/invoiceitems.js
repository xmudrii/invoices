const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const db = require('../db');

// Instanciranje rutera
const route = express.Router();

// Sema za validaciju
const sema = Joi.object().keys({
    invoice_id: Joi.number().precision(0).required(),
    description: Joi.string().trim().required(),
    unit: Joi.string().trim().max(4).required(),
    count: Joi.number().precision(3).required(),
    price: Joi.number().precision(2).required(),
    tax_rate_id: Joi.number().precision(0).required(),
});

// Koristi JSON Middleware za parsiranje requestova
route.use(express.json());

// Lista svih stavki za racun
route.get('/:invoice/items', (req, res) => {
    let query = 'select * from invoice_item where invoice_id=?;';
    let formatted = mysql.format(query, [req.params.invoice]);

    db.query(formatted, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

// Kreiranje nove stavke za racun
route.post('/:invoice/items', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje error-a
    let { error } = Joi.validate(req.body, sema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        // SQL query
        let query = "insert into invoice_item (invoice_id, description, unit, count, price, tax_rate_id) values (?, ?, ?, ?, ?, ?);";
        let formatted = mysql.format(query, [
            req.params.invoice,
            req.body.description,
            req.body.unit,
            req.body.count,
            req.body.price,
            req.body.tax_rate_id
        ]);

        db.query(formatted, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske, vracamo kreirani objekat
                query = 'select * from invoice_item where id=?;'
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

// Pojedinacna stavka
route.get('/item/:id', (req, res) => {
    let query = 'select * from invoice_item where id=?;';
    let formatted = mysql.format(query, [req.params.id]);

    db.query(formatted, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else if (rows.length === 0)
            res.status(404).send('invoice item not found');
        else
            res.send(rows[0]);
    });
});

// Azuriranje stavke
route.put('/item/:id', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje unosa
    let { error } = Joi.validate(req.body, sema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        // SQL query
        let query = "update invoice_item set description=?, unit=?, count=?, price=?, tax_rate_id=? where id=?;";
        let formatted = mysql.format(query, [
            req.body.description,
            req.body.unit,
            req.body.count,
            req.body.price,
            req.body.tax_rate_id,
            req.params.id
        ]);

        db.query(formatted, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else if (response.affectedRows === 0)
                res.status(404).send("invoice item not found");
            else {
                // Ako nema greske, vracamo kreirani objekat
                query = 'select * from invoice_item where id=?;'
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

// Brisanje stavke
route.delete('/item/:id', (req, res) => {
    let query = 'select * from invoice_item where id=?;';
    let formatted = mysql.format(query, [req.params.id]);

    db.query(formatted, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else if (rows.length === 0)
            res.status(404).send("invoice item not found");
        else {
            let city = rows[0];

            let query = 'delete from invoice_item where id=?';
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
