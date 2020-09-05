const express = require('express');
const path = require('path');
const routes = require('./routes/web')
const app = express();

require('dotenv').config({
    path: 'comicsWeb.env'
})

app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "pug")

app.use(express.static(path.join(__dirname, "public")));

app.use('/', routes)
app.use('/:comicNum/info.0.json', routes)

// start the app
app.set('port', process.env.PORT || 5000)

const server = app.listen(app.get('port'), () => {
    console.log(`My comic is running → PORT ${server.address().port}`)
});