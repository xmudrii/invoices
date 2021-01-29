const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const db = require('../database/connect');
const auth = require('../auth/authorization');

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

// Sema za validaciju
const semaInsert = Joi.object().keys({
    number: Joi.string().optional().allow(null).allow(""),
    date: Joi.string().optional().allow(null).allow(''),
    date_from: Joi.string().optional().allow(null).allow(''),
    date_to: Joi.string().optional().allow(null).allow(''),
    company_id: Joi.number().precision(0).required(),
    remarks: Joi.string().optional().allow(null).allow(''),
});

// Koristi JSON Middleware za parsiranje requestova
route.use(express.json());

// Lista svih racuna
route.get('/', auth.isAuthorizedUser, (req, res) => {
    let query = "SELECT `invoice`.`id`, `invoice`.`number`, `invoice`.`date` AS `date`, `invoice`.`date_from` AS `date_from`, `invoice`.`date_to` AS `date_to`, `invoice`.`company_id`, `invoice`.`remarks`, `invoice`.`created_at`, `invoice`.`updated_at`, `company`.`name` AS `company_name`, COALESCE(SUM((`invoice_item`.`count` * `invoice_item`.`price`)), 0) AS `net_price`, COALESCE(SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100)), 0) AS `tax_total`, COALESCE((SUM((`invoice_item`.`count` * `invoice_item`.`price`)) + SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100))), 0) AS `total` " +
        "FROM `invoice` " +
        "LEFT OUTER JOIN `invoice_item` ON (`invoice`.`id` = `invoice_item`.`invoice_id`) " +
        "LEFT OUTER JOIN `sys_tax_rate` ON (`invoice_item`.`tax_rate_id` = `sys_tax_rate`.`id`) " +
        "INNER JOIN `company` ON `invoice`.`company_id` = `company`.`id` " +
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
route.get('/:id', auth.isAuthorizedUser, (req, res) => {
    if(isNaN(req.params.id)) {
        res.status(400).send('id must be a number');
        return;
    }

    let query = "SELECT `invoice`.`id`, `invoice`.`number`, `invoice`.`date` AS `date`, `invoice`.`date_from` AS `date_from`, `invoice`.`date_to` AS `date_to`, `invoice`.`company_id`, `invoice`.`remarks`, `invoice`.`created_at`, `invoice`.`updated_at`, `company`.`name` AS `company_name`, COALESCE(SUM((`invoice_item`.`count` * `invoice_item`.`price`)), 0) AS `net_price`, COALESCE(SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100)), 0) AS `tax_total`, COALESCE((SUM((`invoice_item`.`count` * `invoice_item`.`price`)) + SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100))), 0) AS `total` " +
        "FROM `invoice` " +
        "LEFT OUTER JOIN `invoice_item` ON (`invoice`.`id` = `invoice_item`.`invoice_id`) " +
        "LEFT OUTER JOIN `sys_tax_rate` ON (`invoice_item`.`tax_rate_id` = `sys_tax_rate`.`id`) " +
        "INNER JOIN `company` ON `invoice`.`company_id` = `company`.`id` " +
        'WHERE `invoice`.`id`=? ' +
        "GROUP BY `invoice`.`id`";
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
route.post('/', auth.isAuthorizedUser, (req, res) => {
    // Validacija unosa
    // Object decomposition - dohvatanje error-a
    let { error } = Joi.validate(req.body, semaInsert);

    if(error)
        // Vrati gresku zahteva
        res.status(400).send(error.details[0].message);
    else {
        if(req.body.number === undefined || req.body.number === null) {
            let next_num_query = "SELECT COALESCE(LPAD(CAST(`invoice`.`number` AS UNSIGNED)+1, 5, '0'), '00001') AS `next_number` FROM `invoice` ORDER BY `invoice`.`number` DESC LIMIT 1;"
            db.query(next_num_query, (err, rows) => {
                if (err)
                    // Greska servera
                    res.status(500).send(err.sqlMessage);
                else {
                    // SQL query
                    let query = "insert into invoice (number, date, date_from, date_to, company_id, remarks) values (?, ?, ?, ?, ?, ?);";
                    let formatted = mysql.format(query, [
                        rows[0].next_number,
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
                            query = "SELECT `invoice`.`id`, `invoice`.`number`, `invoice`.`date` AS `date`, `invoice`.`date_from` AS `date_from`, `invoice`.`date_to` AS `date_to`, `invoice`.`company_id`, `invoice`.`remarks`, `invoice`.`created_at`, `invoice`.`updated_at`, `company`.`name` AS `company_name`, COALESCE(SUM((`invoice_item`.`count` * `invoice_item`.`price`)), 0) AS `net_price`, COALESCE(SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100)), 0) AS `tax_total`, COALESCE((SUM((`invoice_item`.`count` * `invoice_item`.`price`)) + SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100))), 0) AS `total` " +
                                "FROM `invoice` " +
                                "LEFT OUTER JOIN `invoice_item` ON (`invoice`.`id` = `invoice_item`.`invoice_id`) " +
                                "LEFT OUTER JOIN `sys_tax_rate` ON (`invoice_item`.`tax_rate_id` = `sys_tax_rate`.`id`) " +
                                "INNER JOIN `company` ON `invoice`.`company_id` = `company`.`id` " +
                                'WHERE `invoice`.`id`=? ' +
                                "GROUP BY `invoice`.`id`";
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
                    query = "SELECT `invoice`.`id`, `invoice`.`number`, `invoice`.`date` AS `date`, `invoice`.`date_from` AS `date_from`, `invoice`.`date_to` AS `date_to`, `invoice`.`company_id`, `invoice`.`remarks`, `invoice`.`created_at`, `invoice`.`updated_at`, `company`.`name` AS `company_name`, COALESCE(SUM((`invoice_item`.`count` * `invoice_item`.`price`)), 0) AS `net_price`, COALESCE(SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100)), 0) AS `tax_total`, COALESCE((SUM((`invoice_item`.`count` * `invoice_item`.`price`)) + SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100))), 0) AS `total` " +
                        "FROM `invoice` " +
                        "LEFT OUTER JOIN `invoice_item` ON (`invoice`.`id` = `invoice_item`.`invoice_id`) " +
                        "LEFT OUTER JOIN `sys_tax_rate` ON (`invoice_item`.`tax_rate_id` = `sys_tax_rate`.`id`) " +
                        "INNER JOIN `company` ON `invoice`.`company_id` = `company`.`id` " +
                        'WHERE `invoice`.`id`=? ' +
                        "GROUP BY `invoice`.`id`";
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

// Azuriranje racuna
route.put('/:id', auth.isAuthorizedUser, (req, res) => {
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
                query = "SELECT `invoice`.`id`, `invoice`.`number`, `invoice`.`date` AS `date`, `invoice`.`date_from` AS `date_from`, `invoice`.`date_to` AS `date_to`, `invoice`.`company_id`, `invoice`.`remarks`, `invoice`.`created_at`, `invoice`.`updated_at`, `company`.`name` AS `company_name`, COALESCE(SUM((`invoice_item`.`count` * `invoice_item`.`price`)), 0) AS `net_price`, COALESCE(SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100)), 0) AS `tax_total`, COALESCE((SUM((`invoice_item`.`count` * `invoice_item`.`price`)) + SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100))), 0) AS `total` " +
                    "FROM `invoice` " +
                    "LEFT OUTER JOIN `invoice_item` ON (`invoice`.`id` = `invoice_item`.`invoice_id`) " +
                    "LEFT OUTER JOIN `sys_tax_rate` ON (`invoice_item`.`tax_rate_id` = `sys_tax_rate`.`id`) " +
                    "INNER JOIN `company` ON `invoice`.`company_id` = `company`.`id` " +
                    'WHERE `invoice`.`id`=? ' +
                    "GROUP BY `invoice`.`id`";
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
route.delete('/:id', auth.isAuthorizedAdmin, (req, res) => {
    if(isNaN(req.params.id)) {
        res.status(400).send('id must be a number');
        return;
    }

    let query = "SELECT `invoice`.`id`, `invoice`.`number`, `invoice`.`date` AS `date`, `invoice`.`date_from` AS `date_from`, `invoice`.`date_to` AS `date_to`, `invoice`.`company_id`, `invoice`.`remarks`, `invoice`.`created_at`, `invoice`.`updated_at`, `company`.`name` AS `company_name`, COALESCE(SUM((`invoice_item`.`count` * `invoice_item`.`price`)), 0) AS `net_price`, COALESCE(SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100)), 0) AS `tax_total`, COALESCE((SUM((`invoice_item`.`count` * `invoice_item`.`price`)) + SUM((((`invoice_item`.`count` * `invoice_item`.`price`) * `sys_tax_rate`.`value`) / 100))), 0) AS `total` " +
        "FROM `invoice` " +
        "LEFT OUTER JOIN `invoice_item` ON (`invoice`.`id` = `invoice_item`.`invoice_id`) " +
        "LEFT OUTER JOIN `sys_tax_rate` ON (`invoice_item`.`tax_rate_id` = `sys_tax_rate`.`id`) " +
        "INNER JOIN `company` ON `invoice`.`company_id` = `company`.`id` " +
        'WHERE `invoice`.`id`=? ' +
        "GROUP BY `invoice`.`id`";
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
