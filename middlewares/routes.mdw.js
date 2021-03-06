const restrict = require('../middlewares/auth.mdw');

module.exports = function (app) {
    app.use('/', require('../routes/home.route'));
    app.use('/account', require('../routes/account.route'));
    app.use('/category', require('../routes/product.route'));
    app.use('/admin/category', (req, res, next) => {
        if (!res.locals.isAdmin)
          return res.redirect('/');
        next();
    }, require('../routes/admin/category.route'));
    app.use('/register',require('../routes/account.route'));
    app.use('/login',require('../routes/account.route'));
    app.use('/list', restrict, require('../routes/watch_list.route'));
};