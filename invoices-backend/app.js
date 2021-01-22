const express = require('express');
//const racuni = require('./routes/racuni'); // Racuni ruter (REST API)
const test = require('./routes/test');
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
//app.use('/api', racuni);
app.use('/test', test);

// Vue aplikacija
const staticMiddleware = express.static(path.join(__dirname, 'dist'));

app.use(staticMiddleware);
app.use(history());
app.use(staticMiddleware);

// Pokretanje web servera
app.listen(8081);
