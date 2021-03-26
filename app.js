const express = require('express')
const path = require('path')
const app = express()
const port = 4000

app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res){
    res.render('/index.html');
});

app.get('/newgame', function (req, res){
    res.sendFile(__dirname+'/public/game.html');
});

app.listen(port, () => {
  console.log(`Listening on port :${port}`)
})