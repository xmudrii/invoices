const express = require('express');
const Joi = require('joi');
const db = require('../db')

// Instanciranje rutera
const route = express.Router();

// Koristi JSON Middleware za parsiranje requestova
route.use(express.json());

// Lista svih racuna
route.get('/', (req, res) => {
    db.query('select * from invoices_app_city', (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

module.exports = route;
