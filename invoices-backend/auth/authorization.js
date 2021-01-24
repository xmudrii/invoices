const jwt = require('njwt');
const mysql = require('mysql');
const db = require('../database/connect');
const settings = require('../settings.json');

function isAuthorized(req, res, next, admin) {
    if (req.header("Authorization") === undefined ||
        req.header("Authorization") === null ||
        req.header("Authorization") === "") {
        res.status(401);
        res.set("WWW-Authenticate", 'Basic realm="Access to invoices requires login"');
        return next('Unauthorized: authorization header not present');
    }

    const token = req.header("Authorization").split("Basic ");
    if (token.length !== 2) {
        res.status(401);
        res.set("WWW-Authenticate", 'Basic realm="Access to invoices requires login"');
        return next('Unauthorized: failed to parse header');
    }

    jwt.verify(token[1], settings.jwt_secret, (err, verifiedJwt) => {
        if (err) {
            console.log("auth failed: " + err);

            res.status(401);
            res.set("WWW-Authenticate", 'Basic realm="Access to invoices requires login"');
            return next('Unauthorized: failed to parse header');
        } else {
            let user_id = verifiedJwt.body.sub;
            // Validacija da li korisnik postoji
            let query = 'select * from sys_user where id=?;';
            let formatted = mysql.format(query, [user_id]);

            db.query(formatted, (err, rows) => {
                if (err) {
                    console.log("auth failed: " + err.sqlMessage);

                    res.status(401);
                    res.set("WWW-Authenticate", 'Basic realm="Access to invoices requires login"');
                    return next('Unauthorized');
                } else if (rows.length === 0) {
                    res.status(401);
                    res.set("WWW-Authenticate", 'Basic realm="Access to invoices requires login"');
                    return next('Unauthorized');
                } else {
                    let user = rows[0];
                    if (!user.is_active) {
                        res.status(401);
                        res.set("WWW-Authenticate", 'Basic realm="Access to invoices requires login"');
                        return next('Unauthorized');
                    }
                    if (admin) {
                        if (!user.is_admin) {
                            res.status(403);
                            return next('Forbidden: requires admin access privileges');
                        }
                    }
                    return next();
                }
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
