const express = require('express')
const session = require('express-session')
const dotenv = require('dotenv').config()
const hbs = require('hbs')
const {listCookies, Cookie} = require('./models/Cookie')
const auth = require('./middlewars/auth')
const routerAuth = require('./router/routesAuth')
const routerFav = require('./router/routesFav')
const routerCreate = require('./router/routesCreate')
const {getTasteById} = require('./models/Taste')

const app = express()

app.use(session({
    secret: 'fshdfjkasfakkdjjlkasksksksksjd',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 1 giorno in millisecondi
        secure: false, // Impostare a true in produzione con HTTPS
        httpOnly: true // Evita che il cookie sia accessibile tramite JavaScript
    }
}))

app.use(express.static('public'))
app.use("/css", express.static(__dirname + "/public/css"))
app.set('view engine', 'hbs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

hbs.registerPartials(__dirname+"/views/partial/")

hbs.registerHelper('eq', (a, b) => a === b)

app.get('/', auth, async (req, res) => {
    const cookies = await listCookies()
    for (const cookie of cookies) {
        const taste = await getTasteById(cookie.taste);
        cookie.taste = taste.name; 
    }
    res.render('index', {cookies: cookies})
})

app.use('/auth', routerAuth)

app.use('/favorites', routerFav)

app.use('/create', routerCreate)

// ------ ERROR 404 ------ //
app.get('*', (req, res) => {
    res.status(404).sendFile("404.html", { root: __dirname + "/public/errors" });
});

app.listen(process.env.PORT, () => {
    console.log('Server in ascolto sulla porta ' + process.env.PORT);
});