var enemyNumber = 10;
var width = 800;
var height = 500;
var score = 0;
var highScore = 0;
var collisions = 0;

var gameSpace = d3.select('svg')
  .attr("width", width)
  .attr("height", height); 

class Enemy {
  constructor() {
    this.x = Math.floor(Math.random() * width);
    this.y = Math.floor(Math.random() * height);
    this.r = 15;
  }
  setNewX() {
    this.x = Math.floor(Math.random() * width);
  }
  setNewY() {
    this.y = Math.floor(Math.random() * height);
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.r = 10;
  }
}

var generateEnemyArray = function(enemyNumber) {
  var output = [];
  for (e = 0; e < enemyNumber; e++) {
    output.push(new Enemy);
  }
  return output;
};

var updateEnemies = function() {
  gameSpace.selectAll('.enemy')
    .transition()
    .duration(2000)
    .attr('cx', function(d) { 
      d.setNewX();
      return d.x; 
    })
    .attr('cy', function(d) { 
      d.setNewY();
      return d.y; 
    })
    .attr('r', function(d) {
      return 10 + Math.random() * 40;
    })
    .style('fill', `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`)
    .tween('collision', tweenDetectCollision)
    .each('end', updateEnemies);
};

var enterEnemies = function(data) {
  gameSpace.selectAll('circle').data(data)
    .enter().append('circle')
    .attr('class', 'enemy')
    //.attr('fill', 'url(#image)')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', function(d) { return d.r; });
};

var enterPlayer = function(data) {
  gameSpace.selectAll('.player').data(data)
    .enter().append('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', function(d) { return d.r; })
    .attr('class', 'player');
};

// Collision detection
var tweenDetectCollision = function() {
  return function() {
    var enemy = d3.select(this);
    detectCollision(enemy);
  };
};


var detectCollision = function(enemy) {
  var thePlayer = d3.select('.player');
  var minSep = +thePlayer.attr('r') + +enemy.attr('r');
  xSep = thePlayer.attr('cx') - enemy.attr('cx'),
  ySep = thePlayer.attr('cy') - enemy.attr('cy'),
  sep = Math.sqrt(Math.pow(xSep, 2) + Math.pow(ySep, 2));
  if (sep < minSep) {
    //console.log('Sep: ', sep);
    collisionHandler(thePlayer, enemy);
  }
};

var collisionHandler = function(player, enemy) {
  collisions++;
  d3.select('.collisions').select('span').text(collisions);
  if (score > highScore) {
    highScore = score;
    d3.select('.highscore').select('span').text(score);
  }
  score = 0;
  d3.select('.score').select('span').text(score);
};

var dragHandler = d3.behavior.drag()
  .on("drag", function(d) {
    d3.selectAll('.player')
      .attr("cx", () => d3.event.x )
      .attr("cy", () => d3.event.y );
  });

var incrementScore = function() {
  score++;
  d3.select('.current').selectAll('span').text(score);
};

// Initialize game display
enterEnemies(generateEnemyArray(enemyNumber));

enterPlayer([new Player]);

d3.selectAll('.player').call(dragHandler); 

updateEnemies();

setInterval(incrementScore, 100);
















