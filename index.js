const express = require("express");
const path = require('path');
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require("mongoose");
const moment = require("moment");

require("dotenv").config();


const database = require("./config/database");
const systemConfig = require("./config/system");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(`${__dirname}/public`));

//flash
app.use(cookieParser('HACUTE'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//tinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//locals
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment



route(app)
routeAdmin(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})