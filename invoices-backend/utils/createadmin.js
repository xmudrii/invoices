const prompt = require('prompt');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const db = require('../database/connect');

const saltRounds = 10;

const properties = [
    {
        name: 'username',
    },
    {
        name: 'password',
        hidden: true
    },
    {
        name: 'email',
    },
    {
        name: 'name',
    },
    {
        name: 'surname',
    }
];

function onErr(err) {
    console.log(err);
    return 1;
}

prompt.start();

prompt.get(properties, function (err, result) {
    if (err)
        return onErr(err);

    bcrypt.hash(result.password, saltRounds)
        .then(hash => {
            // SQL query
            let query = "insert into sys_user (username, password, email, name, surname) values (?, ?, ?, ?, ?);";
            let formatted = mysql.format(query, [
                result.username,
                hash,
                result.email,
                result.name,
                result.surname
            ]);

            db.query(formatted, (err, response) => {
                if (err) {
                    console.error(err.sqlMessage);
                    process.exit(1);
                } else {
                    console.log("User created successfully.")
                    process.exit(0);
                }
            });
        });
});
