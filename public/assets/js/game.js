
currentPlayer = 'white';
toastr.options.positionClass = 'toast-bottom-left'
invalid = false;
mScore = 0
oScore = 0

function changeScore(player){
    if(player == "m"){
        mScore = mScore+1;
        $('#mScore').html(mScore)
    }else{
        oScore = oScore+1;
        $('#oScore').html(oScore)
    }
}
var game = new Chess()

var config = {
    draggable: true,
    dropOffBoard: 'snapback',
    moveSpeed: 'slow',
    snapbackSpeed: 500,
    snapSpeed: 100,
    position: 'start',
    onDrop: onDrop,
    onDragStart : onDragStart
}

var board = Chessboard('myBoard',config)
changeMessageAction(currentPlayer)

function onDrop (source, target, move) {

    var mm = game.move({
        from: source,
        to: target,
        promotion: 'q' 
      })
    
  if (mm === null) return 'snapback'
   
  if(mm['captured'] != null){
    changeScore('m')
  }

  if(`${move}`.slice(0,1) != 'b'){
    if(source != target){
        currentPlayer = 'black';
        changeMessageAction(currentPlayer)
        if(currentPlayer != 'white'){

            $.get(`/move?from=${source}&to=${target}&config=${board}`, function(data, status){
                if(`${data}`.includes('invalid-move')){
                    toastr.warning('This is an invalid move.', 'Try Again!')
                    currentPlayer = 'white';
                    changeMessageAction(currentPlayer)
               }else{
                    var gameResponse = data;
        
                    console.log(gameResponse)
                    om = game.move({
                        from: Object.keys(gameResponse.move)[0].toLowerCase(),
                        to: gameResponse.move[Object.keys(gameResponse.move)[0]].toLowerCase(),
                        promotion: 'q' 
                      })

                      if(om['captured'] != null){
                        changeScore('o')
                      }

                      board.move(`${Object.keys(gameResponse.move)[0].toLowerCase()}-${gameResponse.move[Object.keys(gameResponse.move)[0]].toLowerCase()}`);
                      currentPlayer = 'white';
                    changeMessageAction(currentPlayer)
               }
              });

            
        }else{
            return 'snapback'
        }
    }
   }else{
    toastr.error('You cant move a black piece.', 'Play Again!')
    return 'snapback'

   }

  

  
}

function onDragStart (source, piece, position, orientation) {
  
   // do not pick up pieces if the game is over

   if(game.in_checkmate()){
    toastr.success("Checkmate")
    return false;
}
if(game.in_check()){
  toastr.info("You're struck in a check","Check!!")
}
if(game.in_draw()){
  toastr.info("Draw!")
  }
  
  if(game.in_stalemate()){
      toastr.info("Stalemater!")
      return false;

  }

  if (game.game_over()) {
    toastr.info("The game is over. It's already a checkmate.")
    return false
  }

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
          toastr.error("This is not your piece.","Invalid Move")
    return false
  }

  
  }

function changeMessageAction(currentPlayer){

    if(currentPlayer == 'white'){
        $('#message-board').html(`<div class="alert alert-success mt-3 text-center" role="alert">
        It's your turn, please play your move....
      </div>`)
    }else{
        $('#message-board').html(`<div class="alert alert-primary mt-3 text-center" role="alert">
        Waiting for opponents move ....
      </div>`)
    }
};