var express = require('express');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');
//var expressLayouts = require('cloud/node_modules/express-layouts');
var router;

//var routIndex;

app = express();

app.set('views', 'cloud/views');
app.set('view engine', 'ejs');

//app.use(expressLayouts);
//app.use(express.basicAuth());
app.use(parseExpressHttpsRedirect());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('1q2w3e4r5t6y7u8i9o0p'));
app.use(parseExpressCookieSession({
    cookie : {
        maxAge : 3600000
    }
}));
app.use(express.cookieSession());
//app.use(app.router);

//app.locals.parseApplicationId = 'IlisXsvzdK4OGprLSeMCKwrFCpzPb5Tn8oxUmb63';
//app.locals.parseJavascriptKey = 'q6qjSKedBaN4oQFeppADXfzqVamiSA2ZupDvfRu2';

router = require('cloud/routes/index.js');
router(app);



app.listen();
