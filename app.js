var express = require('express');
var exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
const morgan = require('morgan');
const handlebars = require('./helpers/handlebars')(exphbs);
const productModel = require('./models/product.model');
const categoryModel = require('./models/category.model');
const offerModel = require('./models/offer.model');
const moment = require('moment');
const bodyparser = require('body-parser');
const mailer = require('./models/mailer.model');

const bcrypt = require('bcryptjs');
const productRoute = require('./routes/product.route');
const request = require('request');
require('express-async-errors');
var app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(morgan('dev'));
// app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))



require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static('./public'));

app.use((req, res, next) => {
    res.render('vwError/404.hbs', {
        title: 'Not Found',
        layout: false
    });
})

app.use((err, req, res, next) => {
    res.render('vwError/index.hbs', {
        title: 'Error',
        layout: false
    })
    console.error(err.stack);
})

app.listen(3000, () => {
    console.log('Web server running at http://localhost:3000');
})