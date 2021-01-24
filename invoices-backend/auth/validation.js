const mysql = require('mysql');
const db = require('../database/connect');
const jwt = require('njwt');
const settings = require('../settings.json');

function isAuthorized(req, res, next, admin) {
    if (req.header("Authorization") === undefined ||
        req.header("Authorization") === null ||
        req.header("Authorization") === "") {
        res.status(401);
        return next('user not authorized');
    }

    const token = req.header("Authorization").split("Basic ");
    if (token.length !== 2) {
        res.status(400);
        return next('invalid authorization header');
    }

    jwt.verify(token[1], settings.jwt_secret, (err, verifiedJwt) => {
        if (err)
            return next('invalid jwt token');
        else {
            let user_id = verifiedJwt.body.sub;
            // Validacija da li korisnik postoji
            let query = 'select * from sys_user where id=?;';
            let formatted = mysql.format(query, [user_id]);

            db.query(formatted, (err, rows) => {
                if (err)
                    // Greska servera
                    res.status(500).send(err.sqlMessage);
                else if (rows.length === 0) {
                    res.status(401);
                    return next('user not found');
                }
                else
                    if(admin === true) {
                        let user = rows[0];
                        if(!user.is_admin) {
                            res.status(403);
                            return next("user can't access requested resource")
                        }
                    }
                    return next();
            });
        }
    })
}

function isAuthorizedUser(req, res, next) {
    return isAuthorized(req, res, next, false)
}

function isAuthorizedAdmin(req, res, next) {
    return isAuthorized(req, res, next, true)
}

module.exports = {
    isAuthorizedUser: isAuthorizedUser,
    isAuthorizedAdmin: isAuthorizedAdmin,
}
