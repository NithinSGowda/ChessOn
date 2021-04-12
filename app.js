const express = require('express')
const path = require('path')
const app = express()
const port = 4000

const jsChessEngine = require('js-chess-engine')
const game = new jsChessEngine.Game()



app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res){
    res.render('/index.html');
});

app.get('/newgame', function (req, res){
    res.sendFile(__dirname+'/public/game.html');
});


app.get('/move', function(req, res){

  try {
    game.move(req.query.from,req.query.to,req.query.config)
    result = game.aiMove(0,req.query.config)
    res.json({
      move : result,
      board : game.board.configuration
    });
  } catch (error) {
    res.send(`invalid-move;${req.query.to}-${req.query.from}`)

  }
  

});

app.listen(port, () => {
  console.log(`Listening on port :${port}`)
})