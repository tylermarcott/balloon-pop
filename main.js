
// create region by #region at top, #endregion at bottom, allows you to collapse the region

// #region GAME LOGIC AND DATA

// DATA
let clickCount = 0
let height = 120
let width = 100
let inflationRate = 20
let maxSize = 300
let highestPopCount = 0
let currentPopCount = 0 //IMPORTANT NOTE: fn + f2, after highlighting a variable, allows you to rename all instances of said variable.
let gameLength = 10000   // this is 5000 milliseconds
let clockId = 0
let timeRemaining = 0
let currentPlayer = {}   // if we don't give a value, basically says this variable exist, but it's value is nothing. Just declaring the pointer with an empty object
let currentColor = "red"
let possibleColors = ["red", "green", "blue", "purple", "pink"]


// note: what we want to do is make sure that a function only has one responsibility.
// => is a lamba expression
function startGame(){
  document.getElementById("game-controls").classList.remove("hidden")
  document.getElementById("main-controls").classList.add("hidden")
  document.getElementById("scoreboard").classList.add("hidden")
  startClock()
  setTimeout(stopGame, gameLength)
}

function startClock(){
  timeRemaining = gameLength
  drawClock()
  clockId = setInterval(drawClock, 1000)
}

function stopClock(){
  clearInterval(clockId)
}

function drawClock(){
  let countdownElem = document.getElementById('countdown')
  countdownElem.innerText = (timeRemaining / 1000).toString()
  timeRemaining -= 1000
}

// note: we can click arrow which will collapse down functions/code that you don't need to mess with anymore!
function inflate(){
  clickCount++
  height += inflationRate
  width += inflationRate
  checkBalloonPop()
  draw()
}

function checkBalloonPop(){
  if(height >= maxSize){
    console.log("pop the balloon")
    let balloonElement = document.getElementById("balloon")
    balloonElement.classList.remove(currentColor)
    getRandomColor()
    balloonElement.classList.add(currentColor)

    document.getElementById("pop-sound").play()

    currentPopCount++
    height = 0
    width = 0
  }
}

function getRandomColor(){
  let i = Math.floor(Math.random() * possibleColors.length);
  currentColor = possibleColors[i];
}

// anything that is updating the string is in draw function
function draw(){
  let balloonElement = document.getElementById("balloon")
  let clickCountElem = document.getElementById("click-count")
  let popCountElem = document.getElementById('pop-count')
  let highPopCountElem = document.getElementById('high-pop-count')
  let playerNameElem = document.getElementById('player-name')
  
  balloonElement.style.height = height + "px"
  balloonElement.style.width = width + "px"
  
  clickCountElem.innerText = clickCount.toString()
  popCountElem.innerText = currentPopCount.toString()
  highPopCountElem.innerText = currentPlayer.topScore.toString()
  playerNameElem.innerText = currentPlayer.name
}

function stopGame() {
  console.log("The game is over")

  document.getElementById("game-controls").classList.add("hidden")
  document.getElementById("main-controls").classList.remove("hidden")
  document.getElementById("scoreboard").classList.remove("hidden")

  clickCount = 0
  height = 120
  width = 100

  if(currentPopCount > currentPlayer.topScore){
    currentPlayer.topScore = currentPopCount
    savePlayers()
  }

  currentPopCount = 0


  stopClock()
  draw()  //IMPORTANT NOTE: hover over function holding cmd key gives pop up window of what the function that's called actually is
  // also, cmd click will take you straight to the fxn
  drawScoreboard()
}

// #endregion

// object
let players = []
loadPlayers()

// prevents page from reloading when player name submitted
// we are able to gain access through our form by using it's target, which can be found in console on our web page
function setPlayer(event){
  event.preventDefault()
  let form = event.target

  let playerName = form.playerName.value

  currentPlayer = players.find(player => player.name == playerName)

  // in the event that we don't have a current player
  if(!currentPlayer){
    currentPlayer = {name: playerName, topScore: 0}
    players.push(currentPlayer)
    savePlayers()
  }

  form.reset()
  document.getElementById("game").classList.remove("hidden")
  form.classList.add("hidden")
  draw()
  drawScoreboard()
}

function changePlayer(){
  document.getElementById("player-form").classList.remove("hidden")
  document.getElementById("game").classList.add("hidden")
}

function savePlayers(){
  window.localStorage.setItem("players", JSON.stringify(players))
}

function loadPlayers(){
  let playersData = JSON.parse(window.localStorage.getItem("players"))
  if(playersData){
    players = playersData
  }
}


// in this function, we have an example of string interpolation
function drawScoreboard(){
  let template = ""

  players.sort((p1, p2) => p2.topScore - p1.topScore)

  players.forEach(player => {
    template += `
    <div class="d-flex space-between">
    <span>
      <i class="fa fa-user"></i>
      ${player.name}
    </span>
    <span>score: ${player.topScore}</span>
  </div>
    `
  })

  document.getElementById("players").innerHTML = template
}

drawScoreboard()