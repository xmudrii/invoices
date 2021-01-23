const express = require('express');
const cities = require('./routes/cities');
const mycompany = require('./routes/mycompany');
const companies = require('./routes/companies');
const taxrates = require('./routes/taxrates');
const history = require('connect-history-api-fallback');
const path = require('path');

// Inicijalizacija express-a
const app = express();

// Potrebni header-i prilikom razvoja i testiranja Vue aplikacije
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET", "PUT", "POST", "DELETE", "OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Koristi racuni ruter na /api putanji
app.use('/cities', cities);
app.use('/mycompany', mycompany);
app.use('/companies', companies);
app.use('/taxrates', taxrates);

// Vue aplikacija
const staticMiddleware = express.static(path.join(__dirname, 'dist'));

app.use(staticMiddleware);
app.use(history());
app.use(staticMiddleware);

// Pokretanje web servera
app.listen(8081);
