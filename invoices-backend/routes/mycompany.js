const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const db = require('../db');

// Instanciranje rutera
const route = express.Router();

// Sema za validaciju
const sema = Joi.object().keys({
    name: Joi.string().trim().max(50).required(),
    address: Joi.string().trim().max(50).required(),
    tax_number: Joi.string().trim().max(9).required(),
    national_id: Joi.string().trim().max(13).required(),
    email: Joi.string().trim().max(50).required(),
    payment_account: Joi.string().trim().max(25).required(),
    city_id: Joi.number().precision(0).required(),
});

// Koristi JSON Middleware za parsiranje requestova
route.use(express.json());

// Informacije o mojoj kompaniji
route.get('/', (req, res) => {
    db.query('select * from invoices_app_mycompany', (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else if (rows.length === 0)
            res.status(404).send('my company not found');
        else
            res.send(rows[0]);
    });
});

// Kreiranje nove kompanije
// Samo jedna moja kompanija moze da postoji
route.post('/', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje error-a
    let { error } = Joi.validate(req.body, sema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        let countQuery = "select count(*) as cnt from invoices_app_mycompany;"
        db.query(countQuery, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                if (response[0].cnt !== 0)
                    res.status(403).send("only one company can exist");
                else {
                    // SQL query
                    let query = "insert into invoices_app_mycompany (name, address, tax_number, national_id, email, payment_account, city_id, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?);";
                    let formatted = mysql.format(query, [
                        req.body.name,
                        req.body.address,
                        req.body.tax_number,
                        req.body.national_id,
                        req.body.email,
                        req.body.payment_account,
                        req.body.city_id,
                        new Date(),
                    ]);

                    db.query(formatted, (err, response) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else {
                            // Ako nema greske, vracamo kreirani objekat
                            query = 'select * from invoices_app_mycompany where id=?;'
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
            }
        });
    }
});

// Azuriranje moje kompnaije
route.put('/', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje unosa
    let { error } = Joi.validate(req.body, sema);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        // SQL query
        let query = "update invoices_app_mycompany set name=?, address=?, tax_number=?, national_id=?, email=?, payment_account=?;";
        let formatted = mysql.format(query, [
            req.body.name,
            req.body.address,
            req.body.tax_number,
            req.body.national_id,
            req.body.email,
            req.body.payment_account,
            req.body.city_id,
        ]);

        db.query(formatted, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else if (response.affectedRows === 0)
                res.status(404).send("my company not found");
            else {
                // Ako nema greske, vracamo kreirani objekat
                db.query('select * from invoices_app_mycompany;', (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

module.exports = route;