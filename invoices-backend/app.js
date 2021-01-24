const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');
const settings = require('./settings.json');

// Autentikacione rute
if (settings.jwt_secret === undefined || settings.jwt_secret === "") {
    console.error("JWT secret is required!");
    process.exit(1);
}
const auth = require('./auth/routes')

// Rute za aplikaciju
const cities = require('./routes/cities');
const mycompany = require('./routes/mycompany');
const companies = require('./routes/companies');
const taxrates = require('./routes/taxrates');
const invoices = require('./routes/invoices');

// Inicijalizacija express-a
const app = express();

// Potrebni header-i prilikom razvoja i testiranja Vue aplikacije
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", ["GET", "PUT", "POST", "DELETE", "OPTIONS"]);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/', auth);
app.use('/cities', cities);
app.use('/mycompany', mycompany);
app.use('/companies', companies);
app.use('/taxrates', taxrates);
app.use('/invoices', invoices);

// Vue aplikacija
const staticMiddleware = express.static(path.join(__dirname, 'dist'));

app.use(staticMiddleware);
app.use(history());
app.use(staticMiddleware);

let port = process.env.PORT || 80;

// Pokretanje web servera
app.listen(port);
