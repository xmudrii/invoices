const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const db = require('../database/connect');

const invoiceitems = require('./invoiceitems')

// Instanciranje rutera
const route = express.Router();

// Sema za validaciju
const sema = Joi.object().keys({
    number: Joi.string().trim().min(5).max(5).required(),
    date: Joi.string().optional().allow(null).allow(''),
    date_from: Joi.string().optional().allow(null).allow(''),
    date_to: Joi.string().optional().allow(null).allow(''),
    company_id: Joi.number().precision(0).required(),
    remarks: Joi.string().optional().allow(null).allow(''),
});

// Koristi JSON Middleware za parsiranje requestova
route.use(express.json());

// Lista svih racuna
route.get('/', (req, res) => {
    let query = "SELECT `invoice`.`id`, `invoice`.`number`, `invoice`.`date` AS `date`, `invoice`.`date_from` AS `date_from`, `invoice`.`date_to` AS `date_to`, `invoice`.`company_id`, `invoice`.`remarks`, `invoice`.`created_at`, `invoice`.`updated_at`, `company`.`name` AS `company_name`, ROUND(IFNULL((SUM(`invoice_item`.`price`*`invoice_item`.`count`) + (SUM(`invoice_item`.`price`*`invoice_item`.`count`)*`sys_tax_rate`.`value`/100)), 0), 2) AS `total` " +
        "FROM `invoice` " +
        "INNER JOIN `company` ON `invoice`.`company_id` = `company`.`id` " +
        "LEFT JOIN `invoice_item` ON `invoice`.`id` = `invoice_item`.`invoice_id` " +
        "LEFT JOIN `sys_tax_rate` ON `invoice_item`.`tax_rate_id` = `sys_tax_rate`.`id` " +
        "GROUP BY `invoice`.`id`";

    db.query(query, (err, rows) => {
        if (err)
            // Greska servera
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

// Prikaz pojedinacnog racuna
route.get('/:id', (req, res) => {
    let query = 'SELECT `invoice`.`id`, `invoice`.`number`, `invoice`.`date` AS `date`, `invoice`.`date_from` AS `date_from`, `invoice`.`date_to` AS `date_to`, `invoice`.`company_id`, `invoice`.`remarks`, `invoice`.`created_at`, `invoice`.`updated_at`, `company`.`name` AS `company_name`, ROUND(IFNULL((SUM(`invoice_item`.`price`*`invoice_item`.`count`) + (SUM(`invoice_item`.`price`*`invoice_item`.`count`)*`sys_tax_rate`.`value`/100)), 0), 2) AS `total` ' +
        'FROM `invoice` ' +
        'INNER JOIN `company` ON `invoice`.`company_id` = `company`.`id` ' +
        'LEFT JOIN `invoice_item` ON `invoice`.`id` = `invoice_item`.`invoice_id` ' +
        'LEFT JOIN `sys_tax_rate` ON `invoice_item`.`tax_rate_id` = `sys_tax_rate`.`id` ' +
        'WHERE `invoice`.`id`=? ' +
        'GROUP BY `invoice`.`id` ';
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
        let query = "insert into invoice (number, date, date_from, date_to, company_id, remarks) values (?, ?, ?, ?, ?, ?);";
        let formatted = mysql.format(query, [
            req.body.number,
            req.body.date,
            req.body.date_from,
            req.body.date_to,
            req.body.company_id,
            req.body.remarks
        ]);

        db.query(formatted, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske, vracamo kreirani objekat
                query = 'SELECT `invoice`.`id`, `invoice`.`number`, `invoice`.`date` AS `date`, `invoice`.`date_from` AS `date_from`, `invoice`.`date_to` AS `date_to`, `invoice`.`company_id`, `invoice`.`remarks`, `invoice`.`created_at`, `invoice`.`updated_at`, `company`.`name` AS `company_name`, ROUND(IFNULL((SUM(`invoice_item`.`price`*`invoice_item`.`count`) + (SUM(`invoice_item`.`price`*`invoice_item`.`count`)*`sys_tax_rate`.`value`/100)), 0), 2) AS `total` ' +
                    'FROM `invoice` ' +
                    'INNER JOIN `company` ON `invoice`.`company_id` = `company`.`id` ' +
                    'LEFT JOIN `invoice_item` ON `invoice`.`id` = `invoice_item`.`invoice_id` ' +
                    'LEFT JOIN `sys_tax_rate` ON `invoice_item`.`tax_rate_id` = `sys_tax_rate`.`id` ' +
                    'WHERE `invoice`.`id`=? ' +
                    'GROUP BY `invoice`.`id` ';
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
            else if (response.affectedRows === 0)
                res.status(404).send("invoice not found");
            else {
                // Ako nema greske, vracamo kreirani objekat
                query = 'SELECT `invoice`.`id`, `invoice`.`number`, `invoice`.`date` AS `date`, `invoice`.`date_from` AS `date_from`, `invoice`.`date_to` AS `date_to`, `invoice`.`company_id`, `invoice`.`remarks`, `invoice`.`created_at`, `invoice`.`updated_at`, `company`.`name` AS `company_name`, ROUND(IFNULL((SUM(`invoice_item`.`price`*`invoice_item`.`count`) + (SUM(`invoice_item`.`price`*`invoice_item`.`count`)*`sys_tax_rate`.`value`/100)), 0), 2) AS `total` ' +
                    'FROM `invoice` ' +
                    'INNER JOIN `company` ON `invoice`.`company_id` = `company`.`id` ' +
                    'LEFT JOIN `invoice_item` ON `invoice`.`id` = `invoice_item`.`invoice_id` ' +
                    'LEFT JOIN `sys_tax_rate` ON `invoice_item`.`tax_rate_id` = `sys_tax_rate`.`id` ' +
                    'WHERE `invoice`.`id`=? ' +
                    'GROUP BY `invoice`.`id` ';
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
    let query = 'SELECT `invoice`.`id`, `invoice`.`number`, `invoice`.`date` AS `date`, `invoice`.`date_from` AS `date_from`, `invoice`.`date_to` AS `date_to`, `invoice`.`company_id`, `invoice`.`remarks`, `invoice`.`created_at`, `invoice`.`updated_at`, `company`.`name` AS `company_name`, ROUND(IFNULL((SUM(`invoice_item`.`price`*`invoice_item`.`count`) + (SUM(`invoice_item`.`price`*`invoice_item`.`count`)*`sys_tax_rate`.`value`/100)), 0), 2) AS `total` ' +
        'FROM `invoice` ' +
        'INNER JOIN `company` ON `invoice`.`company_id` = `company`.`id` ' +
        'LEFT JOIN `invoice_item` ON `invoice`.`id` = `invoice_item`.`invoice_id` ' +
        'LEFT JOIN `sys_tax_rate` ON `invoice_item`.`tax_rate_id` = `sys_tax_rate`.`id` ' +
        'WHERE `invoice`.`id`=? ' +
        'GROUP BY `invoice`.`id` ';
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

route.use('/', invoiceitems);

module.exports = route;
