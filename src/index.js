/**
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

const app = require('express')();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Auth =  require('./core/auth.js');

app.use(cors());
app.use(cookieParser());
app.use(Auth.isAuthenticated.bind(Auth));

const bodyParser = require('body-parser');
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/manager', require('./route/route.manager.js'));
app.use('/dispatch', require('./route/route.dispatch.js'));
app.use('/login', require('./route/route.login.js'));

// 2 -  run the server
const hostname = 'localhost';
const port = 1234;

app.listen(port, hostname , function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});

