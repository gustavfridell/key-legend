var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var tiles = [];
var score = 0;
var highScore = localStorage.highScore || 0;
var latestScore = 0;
var initialTime;
var currentTime;
var timeLeft;
var alert = null;
var gameOptions = {
    horizontalTiles: 5,
    verticalTiles: 5,
    time: 10
};
var tileBorderWidth = 3;
var tileColors = [];
var touchTop = canvas.height - (canvas.height / gameOptions.horizontalTiles);

var newColor = function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var newTileRow = function () {
    var tileRow = [];
    var blackTile = Math.floor(Math.random()*gameOptions.horizontalTiles);
    for(var ht = 0; ht<gameOptions.horizontalTiles; ht++) {
        tileRow.push(ht === blackTile);
    };
    return tileRow;
};

var addAlert = function (message, ttl) {
    alert = message;
    setTimeout(function() {
        alert = null;
    }, ttl * 1000);
};

var renderTiles = function () {
    for(var vt in tiles) {
        for(var ht in tiles[vt]) {
            var x = (canvas.width / gameOptions.horizontalTiles) * ht;
            var y = (canvas.height / gameOptions.verticalTiles) * vt;
            var tileWidth = canvas.width / gameOptions.horizontalTiles;
            var tileHieght = canvas.height / gameOptions.verticalTiles;
            if(tiles[vt][ht]) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x, y, tileWidth, tileHieght);
                ctx.fillStyle = tileColors[ht];
                ctx.fillRect(x + tileBorderWidth, y + tileBorderWidth, tileWidth - (2 * tileBorderWidth), tileHieght - (2 * tileBorderWidth));
            }
        }
    }
};

var renderTopBar = function () {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, 70);
};

var renderScore = function () {
    ctx.fillStyle = 'white';
    ctx.font = '50px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(score, 10, 15);

    ctx.font = '14px Helvetica';
    ctx.fillText('Score:', 10, 5);
};

var renderHighScore = function () {
    ctx.fillStyle = 'white';
    ctx.font = '30px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('High score: ' + highScore, (canvas.width / 2) - 110, 5);
};

var renderlatestScore = function () {
    ctx.fillStyle = 'white';
    ctx.font = '25px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Latest score: ' + latestScore, (canvas.width / 2) - 110, 35);
};

var renderTime = function () {
    if(initialTime) {
        timeLeft = Math.ceil(gameOptions.time - ((currentTime - initialTime) / 1000));
    } else {
        timeLeft = gameOptions.time;
    }
    if(timeLeft === 0) {
        initialTime = false;
        latestScore = score;
        if(score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', score);
        }
        score = 0;
    }
    ctx.fillStyle = 'white';
    ctx.font = '50px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(timeLeft, canvas.width - 65, 15);

    ctx.font = '14px Helvetica';
    ctx.fillText('Time left:', canvas.width - 65, 5);
};

var renderAlert = function () {
    if(alert) {
        ctx.fillStyle = 'black';
        ctx.font = '50px Helvetica';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(alert, (canvas.width / 2) - 50, (canvas.height / 2) - 50);
    }
};

var render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentTime = Date.now();

    renderTiles();
    renderTopBar();
    renderScore();
    renderHighScore();
    renderlatestScore();
    renderAlert();
    renderTime();
};

var main = function () {
    render();
    requestAnimationFrame(main);
};

var init = function () {
    for(var vt = 0; vt<gameOptions.verticalTiles; vt++) {
        tiles.push(newTileRow());
        tileColors.push(newColor());
    }

    main();
};
init();

var touchStart = function (e) {
    e.preventDefault();
    var x = e.targetTouches[0].pageX;
    var y = e.targetTouches[0].pageY;

    if (y >= touchTop && y <= canvas.height) {
        var tileWidth = canvas.width / gameOptions.horizontalTiles;
        var tile = Math.floor(x / tileWidth);

        for(var t in tiles[tiles.length - 1]) {
            if(tiles[tiles.length - 1][t]) {
                if(JSON.parse(t) === tile) {
                    if(score === 0) {
                        initialTime = Date.now();
                    }
                    score++;
                    tiles.pop();
                    tiles.unshift(newTileRow());
                } else {
                    addAlert('Miss!', 2);
                    initialTime = false;
                    score = 0;
                }
                break;
            }
        };
    }
};

addEventListener('touchstart', touchStart, false);
