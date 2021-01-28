const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const db = require('../database/connect');

// Instanciranje rutera
const route = express.Router();

// Sema za validaciju
const sema = Joi.object().keys({
    number: Joi.string().trim().max(4).required(),
    name: Joi.string().trim().max(50).required(),
    address: Joi.string().trim().max(50).required(),
    tax_number: Joi.string().trim().max(9).required(),
    national_id: Joi.string().trim().max(13).required(),
    email: Joi.string().trim().max(50).required(),
    city_id: Joi.number().precision(0).required(),
});

// Sema za validaciju
const semaInsert = Joi.object().keys({
    number: Joi.string().optional().allow(null).allow(""),
    name: Joi.string().trim().max(50).required(),
    address: Joi.string().trim().max(50).required(),
    tax_number: Joi.string().trim().max(9).required(),
    national_id: Joi.string().trim().max(13).required(),
    email: Joi.string().trim().max(50).required(),
    city_id: Joi.number().precision(0).required(),
});

// Koristi JSON Middleware za parsiranje requestova
route.use(express.json());

// Lista svih komintenata
route.get('/', (req, res) => {
    let query = 'SELECT `company`.*, `sys_city`.`city` AS `city`, `sys_city`.`post_code` AS `post_code` ' +
        'FROM `company` ' +
        'INNER JOIN `sys_city` ON `company`.`city_id` = `sys_city`.`id`;'
    db.query(query, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

// Prikaz pojedinacnog komintenta
route.get('/:id', (req, res) => {
    if(isNaN(req.params.id)) {
        res.status(400).send('id must be a number');
        return;
    }

    let query = 'SELECT `company`.*, `sys_city`.`city` AS `city`, `sys_city`.`post_code` AS `post_code` ' +
        'FROM `company` ' +
        'INNER JOIN `sys_city` ON `company`.`city_id` = `sys_city`.`id` ' +
        'WHERE `company`.`id`=?;'
    let formatted = mysql.format(query, [req.params.id]);

    db.query(formatted, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else if (rows.length === 0)
            res.status(404).send('company not found');
        else
            res.send(rows[0]);
    });
});

// Kreiranje novog komintenta
route.post('/', (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje error-a
    let { error } = Joi.validate(req.body, semaInsert);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        if(req.body.number === undefined || req.body.number === null) {
            let next_num_query = "SELECT COALESCE(CAST(`company`.`number` AS UNSIGNED)+1, '1001') AS `next_number` FROM `company` ORDER BY `company`.`number` DESC LIMIT 1;";
            db.query(next_num_query, (err, rows) => {
                if (err)
                    // Greska servera
                    res.status(500).send(err.sqlMessage);
                else {
                    // SQL query
                    let query = "insert into company (number, name, address, tax_number, national_id, email, city_id) values (?, ?, ?, ?, ?, ?, ?);";
                    let formatted = mysql.format(query, [
                        rows[0].next_number,
                        req.body.name,
                        req.body.address,
                        req.body.tax_number,
                        req.body.national_id,
                        req.body.email,
                        req.body.city_id
                    ]);

                    db.query(formatted, (err, response) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else {
                            // Ako nema greske, vracamo kreirani objekat
                            query = 'SELECT `company`.*, `sys_city`.`city` AS `city`, `sys_city`.`post_code` AS `post_code` ' +
                                'FROM `company` ' +
                                'INNER JOIN `sys_city` ON `company`.`city_id` = `sys_city`.`id` ' +
                                'WHERE `company`.`id`=?;'
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
        } else {
            // SQL query
            let query = "insert into company (number, name, address, tax_number, national_id, email, city_id) values (?, ?, ?, ?, ?, ?, ?);";
            let formatted = mysql.format(query, [
                req.body.number,
                req.body.name,
                req.body.address,
                req.body.tax_number,
                req.body.national_id,
                req.body.email,
                req.body.city_id
            ]);

            db.query(formatted, (err, response) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    // Ako nema greske, vracamo kreirani objekat
                    query = 'SELECT `company`.*, `sys_city`.`city` AS `city`, `sys_city`.`post_code` AS `post_code` ' +
                        'FROM `company` ' +
                        'INNER JOIN `sys_city` ON `company`.`city_id` = `sys_city`.`id` ' +
                        'WHERE `company`.`id`=?;'
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

// Azuriranje komintenta
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
        let query = "update company set number=?, name=?, address=?, tax_number=?, national_id=?, email=?, city_id=? where id=?;";
        let formatted = mysql.format(query, [
            req.body.number,
            req.body.name,
            req.body.address,
            req.body.tax_number,
            req.body.national_id,
            req.body.email,
            req.body.city_id,
            req.params.id
        ]);

        db.query(formatted, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else if (response.affectedRows === 0)
                res.status(404).send("company not found");
            else {
                // Ako nema greske, vracamo kreirani objekat
                query = 'SELECT `company`.*, `sys_city`.`city` AS `city`, `sys_city`.`post_code` AS `post_code` ' +
                    'FROM `company` ' +
                    'INNER JOIN `sys_city` ON `company`.`city_id` = `sys_city`.`id` ' +
                    'WHERE `company`.`id`=?;'
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

// Brisanje komintenta
route.delete('/:id', (req, res) => {
    if(isNaN(req.params.id)) {
        res.status(400).send('id must be a number');
        return;
    }

    let query = 'SELECT `company`.*, `sys_city`.`city` AS `city`, `sys_city`.`post_code` AS `post_code` ' +
        'FROM `company` ' +
        'INNER JOIN `sys_city` ON `company`.`city_id` = `sys_city`.`id` ' +
        'WHERE `company`.`id`=?;'
    let formatted = mysql.format(query, [req.params.id]);

    db.query(formatted, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else if (rows.length === 0)
            res.status(404).send("company not found");
        else {
            let city = rows[0];

            let query = 'delete from company where id=?';
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
