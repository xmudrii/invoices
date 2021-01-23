const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const db = require('../db');

// Instanciranje rutera
const route = express.Router();

// Sema za validaciju
const sema = Joi.object().keys({
    number: Joi.string().trim().min(5).max(5).required(),
    date: Joi.string().optional().allow(''),
    date_from: Joi.string().optional().allow(''),
    date_to: Joi.string().optional().allow(''),
    company_id: Joi.number().precision(0).required(),
    remarks: Joi.string().optional().allow(''),
});

// Koristi JSON Middleware za parsiranje requestova
route.use(express.json());

// Lista svih racuna
route.get('/', (req, res) => {
    db.query('select * from invoice', (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

// Prikaz pojedinacnog racuna
route.get('/:id', (req, res) => {
    let query = 'select * from invoice where id=?;';
    let formatted = mysql.format(query, [req.params.id]);

    db.query(formatted, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else if (rows.length === 0)
            res.status(404).send('invoice not found');
        else
            res.send(rows[0]);
    });
});

// Kreiranje novog recuna
route.post('/', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje error-a
    let { error } = Joi.validate(req.body, sema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        // SQL query
        let created_at = new Date();
        let query = "insert into invoice (number, date, date_from, date_to, company_id, remarks, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?);";
        let formatted = mysql.format(query, [
            req.body.number,
            req.body.date,
            req.body.date_from,
            req.body.date_to,
            req.body.company_id,
            req.body.remarks,
            created_at,
            created_at,
        ]);

        db.query(formatted, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske, vracamo kreirani objekat
                query = 'select * from invoice where id=?;'
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

// Azuriranje racuna
route.put('/:id', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje unosa
    let { error } = Joi.validate(req.body, sema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        // SQL query
        let query = "update invoice set number=?, date=?, date_from=?, date_to=?, company_id=?, remarks=? where id=?;";
        let formatted = mysql.format(query, [
            req.body.number,
            req.body.date,
            req.body.date_from,
            req.body.date_to,
            req.body.company_id,
            req.body.remarks,
            req.params.id
        ]);

        db.query(formatted, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske, vracamo kreirani objekat
                query = 'select * from invoice where id=?;'
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

// Brisanje racuna
route.delete('/:id', (req, res) => {
    let query = 'select * from invoice where id=?;';
    let formatted = mysql.format(query, [req.params.id]);

    db.query(formatted, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else if (rows.length === 0)
            res.status(404).send("invoice not found");
        else {
            let city = rows[0];

            let query = 'delete from invoice where id=?';
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
