/*
The Game Project - final
*/
var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var PlayerD;

var canyons;
var mountains;
var collectables;
var trees_x;
var treePos_y;
var  cameraPosX;
var flagpole;

//gamescore
var game_score;
//lives
var lives;

var platforms;
var enemies;

//s0und
var jumpSound;
var loseSound;
var winSound;

function preload() {

 soundFormats('mp3','wav');
    
    //load your sounds here
   
    jumpSound = loadSound('assets/jump.mp3');
    jumpSound.setVolume(0.2);
    
    loseSound = loadSound('assets/fall.mp3');
    loseSound.setVolume(0.2);
    
    winSound = loadSound('assets/win.mp3');
    winSound.setVolume(0.2);
}

function setup() 
{
    createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;
    startGame();
}



function startGame()
{
    gameChar_x = width/40;
	gameChar_y = floorPos_y;
    
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    
    
    enemies =[];
    enemies.push (new Enemy(100, floorPos_y-9, 90));
    enemies.push (new Enemy(700, floorPos_y-9, 90));
    
    collectables = [
        {
        x_pos: 70,
        y_pos: 370,
        size: 55,
        isFound: false,
        },
         {
        x_pos: 900,
        y_pos: 370,
        size: 55,
        isFound: false,
        },
                 {
        x_pos: 400,
        y_pos: 370,
        size: 55,
        isFound: false,
        } ]

    canyons = [
        {
            x:120,  
            width: 70,
              },
           {
            x:420,  
            width: 200,
              },
           {
            x:820,  
            width: 70,
              }     
               ]
    
    platforms = [];
    platforms.push (createPlatforms(120,floorPos_y-60,60));
    platforms.push (createPlatforms(450,floorPos_y-60,80));
    platforms.push (createPlatforms(750,floorPos_y-60,60));
    
    trees_x = [20, 300, 500,900,1150, 1400];
    treePos_y = floorPos_y;
    
    clouds = [{x_pos: 100, 
               y_pos: 20, 
               size: 50}, 
              {x_pos: 400, 
               y_pos: 25, 
               size: 52}, 
             {x_pos: 700, 
               y_pos: 23, 
               size: 50},
             {x_pos: 1050, 
               y_pos: 22, 
               size: 49}
              ];
    
    mountains= [{x_pos: 100, 
               y_pos: 20, 
               size: 50}, 
              {x_pos: 400, 
               y_pos: 20, 
               size: 50}, 
             {x_pos: 700, 
               y_pos: 20, 
               size: 50},
             {x_pos: 1050, 
               y_pos: 20, 
               size: 50}
              ];
    
    flagpole = {isReached: false, x_pos: 999};
    cameraPosX = 0;
    game_score = 0;
    PlayerD = false;
}

function draw()
{

    ///////////DRAWING CODE//////////

	background(25,25,80); 
    noStroke();
	fill(0,155,0);
    rect(0, floorPos_y, width, height - floorPos_y);
    
    

    //cameraPos
    cameraPosX = gameChar_x - width / 2     
    push();
    translate(-cameraPosX, 0); // camera setting
    
    //draw clouds
     drawClouds();

    //m0untains
    drawMountains ();
    
    //draw trees 
     drawTrees ();
    
    //draw the canyon
     for (var j = 0 ; j < canyons.length ; j++)
         {
             drawCanyon  (canyons[j]);
             checkCanyon (canyons[j]); // falling int0 cany0n
         }
    
    strokeWeight (2)       
    //a collectable token
    
      for (var i = 0 ; i < collectables.length ; i++)
      {
          if(!collectables[i].isFound)
     {
          drawCollectable (collectables[i]);
          checkCollectable (collectables[i]);}
    }


    // draw platf0rms
     for (var j = 0 ; j < platforms.length ; j++)
         {
             platforms[j].draw();
         }
	
    // renderFlagpole
    renderFlagpole ();
    
    if(flagpole.isReached == false)
        {
            checkFlagpole();
        }

 if (flagpole.isReached){
    textAlign (CENTER);
    textSize(30);
    text ("You win :) Press space to continue", flagpole.x_pos, floorPos_y - 280);
     
     }
    
    //enemies
      for (var j = 0 ; j < enemies.length ; j++)
         {
             enemies[j].draw();
             var isEnemy = enemies[j].checkEnemy (gameChar_x,gameChar_y);
             
             if (isEnemy )
                 {
                     PlayerD = true;
                        lives -= 1;
                     
                     if (lives > 0)
                         {
                            startGame() ;
                            // break;
                         }
                 }
         }
    
   	//the game character
    drawGameChar ();
    
    //rest0re 0riginal state
    pop();

    checkPlayerDie();
    // GAME 0VER
    
    if ( lives <  1 )
            {
              
    push();
    fill (200, 66, 44);
    textAlign(CENTER);
    textSize(28);
    text("Game over. Press space to continue", width/2, height/2);
    loseSound.play(); // Set the number of loops to 0
    pop();
    isPlummeting == false;
    lives = constrain(lives, 0, 3);
    isLeft = false;
    isRight = false;
    noLoop();
            }
    
    

	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here
    if (!PlayerD)
    {
      if (isLeft == true){
        gameChar_x -= 4;
        }
        
      if (isRight == true){
        gameChar_x += 4;
        }
        
    if (gameChar_y < floorPos_y)
    {
        var isJump = false;
        for (var j = 0 ; j < platforms.length ; j++)
         {
             if( platforms[j].checkJump(gameChar_x, gameChar_y) == true)
             {
            isJump = true;
                 isFalling  = false;
            break;
        }
         }
        if (isJump  == false)
        { isFalling = true;
        gameChar_y += 5;}
       
        }
    else{
        isFalling = false;
        }
     }
 if (isPlummeting){ 
        gameChar_y += 5;
        }


       
 //scoreboard
    fill(255);
    noStroke();
    text("SCORE: " + game_score,  800, 20);
    
//life counter
    fill(255);
    noStroke();
    text("LIVES: " + lives, 800, 40);
     drawLives();

}

  function keyPressed()

{// if statements to control the animation of the character when keys are pressed.
    if (keyCode == 37)
    {            
        console.log ("left arrow");
        isLeft = true;
        }    
    else if (keyCode == 39)
    {            
        console.log ("right arrow");
        isRight = true;
        }  
    if ( keyCode == 38 || keyCode == '' )
    {
         jumpSound.play()
        if (gameChar_y > 300) 
        {
        gameChar_y -= 130;
           
            }
        }
    if (keyCode == 38 && gameChar_y < floorPos_y)
    {   console.log ("no jump");
        isFalling = !isFalling;
        } 
    if (isPlummeting)
    {      
        isLeft = false;
        isRight  = false;
        isFalling = false;
        }
}

function keyReleased()

{
	// if statements to control the animation of the character when
	// keys are released.
	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
    
    if (keyCode == 37)
    {
        console.log ("left arrow")
        isLeft = false
        }    
    else if (keyCode == 39)
    {            
        console.log ("right arrow")
        isRight = false
        } 
    else if(keyCode == 38)
    {            
        console.log ("up arrow")
        isFalling = false
        } 
}

function  drawClouds()
{
        for (var i = 0 ; i < clouds.length ; i++){
        console.log ("clouds loop" + i);
        fill (90)
        ellipse (clouds[i].x_pos + 100, clouds[i].y_pos + 130,clouds[i].size + 30,clouds[i].size +30);
        ellipse (clouds[i].x_pos + 60,clouds[i].y_pos + 130,clouds[i].size+ 10,clouds[i].size + 10);
        ellipse (clouds[i].x_pos + 140,clouds[i].y_pos + 130,clouds[i].size + 10,clouds[i].size + 10);
     }   
   } 
function  drawMountains ()
{
    for (var i = 0 ; i < mountains.length ; i++){
        console.log ("m0untains loop" + i);
        fill (128,128,100);
        strokeWeight(2);
        triangle (mountains[i].x_pos+ 300, floorPos_y , mountains[i].x_pos+ 450,200,mountains[i].x_pos+ 600, floorPos_y );
        triangle (mountains[i].x_pos+ 200, floorPos_y , mountains[i].x_pos+ 350,200, mountains[i].x_pos+ 500, floorPos_y );
        fill (255);
        triangle (mountains[i].x_pos+ 299,mountains[i].y_pos+ 260,mountains[i].x_pos+ 350,200,mountains[i].x_pos+ 410, mountains[i].y_pos+ 260);
        triangle (mountains[i].x_pos+ 400,280,mountains[i].x_pos+ 450,200,mountains[i].x_pos+ 500, 280);
        ellipse (mountains[i].x_pos+ 450,mountains[i].y_pos+ 250,mountains[i].size- 10,mountains[i].size- 10);
        ellipse (mountains[i].x_pos+ 470,mountains[i].y_pos+ 250,mountains[i].size- 10,mountains[i].size- 10);
        ellipse (mountains[i].x_pos+ 430,mountains[i].y_pos+ 250,mountains[i].size- 10,mountains[i].size- 10);

        ellipse (mountains[i].x_pos+ 350,mountains[i].y_pos+ 250,mountains[i].size- 10,mountains[i].size- 10);
        ellipse (mountains[i].x_pos+ 370,mountains[i].y_pos+ 250,mountains[i].size- 10,mountains[i].size- 10);
        ellipse (mountains[i].x_pos+ 330,mountains[i].y_pos+ 250,mountains[i].size- 10,mountains[i].size- 10);
      }  
      } 
function  drawTrees ()
{
        for (var i = 0 ; i < trees_x.length ; i++){
        console.log ("trees loop" + i);
   	    strokeWeight(10);
        stroke (128,100,40);
        beginShape (LINES);
        vertex (trees_x[i], treePos_y);
        vertex (trees_x[i],treePos_y - 440 + 380);
        endShape ();

        strokeWeight(5);
        line (trees_x[i],treePos_y - 40,trees_x[i] - 20, treePos_y - 50);
        line (trees_x[i] - 20, treePos_y - 50,trees_x[i] - 40, treePos_y - 70);
        line (trees_x[i], treePos_y - 40,trees_x[i] + 20, treePos_y - 50 );
        line (trees_x[i] + 20, treePos_y - 50,trees_x[i] + 40, treePos_y - 70);
        noStroke ()
        fill(0,255,0);
        ellipse (trees_x[i], treePos_y - 80,50,50);
        fill(0,255,0, 180);
        ellipse (trees_x[i] - 30, treePos_y - 80,50,50);
        ellipse (trees_x[i] + 30, treePos_y - 80,50,50);
        fill(0,255,0, 190);
        ellipse (trees_x[i],treePos_y - 110 ,50,50);
    }
      } 

function drawCollectable (t_collectable)
{

    if (t_collectable.isFound == false)
        {
        fill(255,255,0);
        ellipse (t_collectable.x_pos,t_collectable.y_pos,t_collectable.size - 40,t_collectable.size - 40);  
        stroke (255,255,0);
        strokeWeight(3);
        line (t_collectable.x_pos - 10,t_collectable.y_pos - 10,t_collectable.x_pos + 10,t_collectable.y_pos + 10);
        line (t_collectable.x_pos + 10,t_collectable.y_pos  - 10,t_collectable.x_pos -10,t_collectable.y_pos +10 );
        line (t_collectable.x_pos - 17,t_collectable.y_pos  ,t_collectable.x_pos + 17,t_collectable.y_pos  );
        line (t_collectable.x_pos ,t_collectable.y_pos  - 17,t_collectable.x_pos ,t_collectable.y_pos  + 17);
        }
     }

function drawCanyon  (t_canyon)
{
    noStroke();
    fill(0);
    rect (t_canyon.x, floorPos_y, t_canyon.width, height - floorPos_y);
     }

function checkCollectable (t_collectable)
{
     if(dist( t_collectable.x_pos, t_collectable.y_pos, gameChar_x, gameChar_y)<= 65)
        {
        t_collectable.isFound = true;
        game_score += 1;
        }
      }

function checkCanyon  (t_canyon)
{
    if (gameChar_x > t_canyon.x &&
        gameChar_x < (t_canyon.x + t_canyon.width) 
        && (gameChar_y >= floorPos_y))
    {
        isPlummeting =  true;
        }
      }
function renderFlagpole () 
{
    push ()
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    fill(255,99,71);
    pop ()
    if(flagpole.isReached)
        {
            fill(255,99,71)
            rect(flagpole.x_pos, floorPos_y - 250, 100, 50)
            PlayerD   =  true;
            winSound.play ();
            noLoop();
              
        }
    else
        {
            fill(255,99,71)
            rect(flagpole.x_pos, floorPos_y - 60, 100, 50)
        }
    
}

function checkFlagpole()
{
    var d = abs(gameChar_x - flagpole.x_pos);
    
    if(d < 15)
        {
            flagpole.isReached = true;
        }
}
function drawLives()
{
    for (var i = 0; i < lives; i++){
            strokeWeight (1);
            stroke (0);
        fill (0,255,0);
        ellipse(40*i + 870,35, 20, 25);
    }
}

function checkPlayerDie()
{
    if (gameChar_y > height)
    {
        PlayerD = true;
        lives -= 1;
              
   if(lives > 0)
        {
            startGame();
        }
    }
    }

function drawGameChar () 
{
if(isLeft && isFalling)
	{
		// add your jumping-left code
        //face
        fill (135,206,235);
        stroke (0);
        ellipse (gameChar_x ,gameChar_y - 55, 32 );
        fill (0);
        ellipse (gameChar_x - 5 ,gameChar_y - 57, 5 );
        fill (0);
        line (gameChar_x - 15,gameChar_y - 48,gameChar_x - 5 ,gameChar_y - 48);
        // square and legs
        fill(255,255,0);
        stroke (0);
        rect (gameChar_x - 13,gameChar_y - 40, 26, 30);
        fill(0);
        rect(gameChar_x - 20,gameChar_y - 18, 10, 10);
        //arms     
        fill(0);
        rect(gameChar_x - 20,gameChar_y - 40,  14,5);
	}
	else if(isRight && isFalling)
	{
        // add your jumping-right code
        //face
        fill (135,206,235);
        stroke (0);
        ellipse (gameChar_x ,gameChar_y - 55, 32 );
        fill (0);
        ellipse (gameChar_x + 5 ,gameChar_y - 57, 5 );
        fill (0);
        line (gameChar_x + 15,gameChar_y - 48,gameChar_x + 5 ,gameChar_y - 48);
        // square and legs
        fill(255,255,0);
        stroke (0);
        rect (gameChar_x - 13,gameChar_y - 40, 26, 30);
        fill(0);
        rect(gameChar_x + 10,gameChar_y - 16, 10, 10);
        //arms     
        fill(0);
        rect(gameChar_x + 7,gameChar_y - 40,  14,5);
    }
	else if(isLeft)
	{
		// add your walking left code
        //face
        fill (135,206,235);
        stroke (0);
        ellipse (gameChar_x ,gameChar_y - 55, 32 );
        fill (0);
        ellipse (gameChar_x - 5 ,gameChar_y - 57, 5 );
        fill (0);
        line (gameChar_x - 15,gameChar_y - 48,gameChar_x - 5 ,gameChar_y - 48);
        // square and legs
        fill(255,255,0);
        stroke (0);
        rect (gameChar_x - 13,gameChar_y - 40, 26, 30);
        fill(0);
        rect(gameChar_x - 11 ,gameChar_y - 10, 10, 10);
        fill(0);
        rect(gameChar_x + 3,gameChar_y - 10, 10, 10);
        //arms     
        fill(0);
        rect(gameChar_x - 5,gameChar_y - 38,  5,14);
	}
	else if(isRight)
	{
		// add your walking right code
        //face
        fill (135,206,235);
        stroke (0);
        ellipse (gameChar_x ,gameChar_y - 55, 32 );
        fill (0);
        ellipse (gameChar_x + 5 ,gameChar_y - 57, 5 );
        fill (0);
        line (gameChar_x + 15,gameChar_y - 48,gameChar_x +5 ,gameChar_y - 48);
        // square and legs
        fill(255,255,0);
        stroke (0);
        rect (gameChar_x - 13,gameChar_y - 40, 26, 30);
        fill(0);
        rect(gameChar_x - 11 ,gameChar_y - 10, 10, 10);
        fill(0);
        rect(gameChar_x + 3,gameChar_y - 10, 10, 10);
        //arms     
        fill(0);
        rect(gameChar_x - 5,gameChar_y - 38,  5,14);
        }
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill (135,206,235);
        stroke (0);
        ellipse (gameChar_x ,gameChar_y - 55, 32 );
        fill (0);
        ellipse (gameChar_x - 7 ,gameChar_y - 57, 5 );
        fill (0);
        ellipse (gameChar_x + 7 ,gameChar_y - 57, 5 );
        fill (0);
        line (gameChar_x + 4 ,gameChar_y - 48,gameChar_x - 4 ,gameChar_y - 48);
        // square and legs
        fill(255,255,0);
        stroke (0);
        rect (gameChar_x - 13,gameChar_y - 40, 26, 30);
        fill(0);
        rect(gameChar_x - 15,gameChar_y - 18, 10, 10);
        fill(0);
        rect(gameChar_x + 5,gameChar_y - 18, 10, 10);
        //arms
        fill(0);
        rect(gameChar_x - 25,gameChar_y - 38, 10, 5);
        fill(0);
        rect(gameChar_x + 15,gameChar_y - 38, 10, 5);
	}
	else
	{
		// add your standing front facing code
        fill (135,206,235);
        stroke (0);
        ellipse (gameChar_x ,gameChar_y - 55, 32 );
        fill (0);
        ellipse (gameChar_x - 7 ,gameChar_y - 57, 5 );
        fill (0);
        ellipse (gameChar_x + 7 ,gameChar_y - 57, 5 );
        fill (0);
        line (gameChar_x + 4 ,gameChar_y - 48,gameChar_x - 4 ,gameChar_y - 48);
        // square and legs
        fill(255,255,0);
        stroke (0);
        rect (gameChar_x - 13,gameChar_y - 40, 26, 30);
        fill(135,206,235);
        rect(gameChar_x - 15,gameChar_y - 10, 10, 10);
        rect(gameChar_x + 5,gameChar_y - 10, 10, 10);
	}
}

function createPlatforms (x, y, length) {
    
    var p = {
        x: x,
        y: y,
        length:length,
        draw: function (){
        fill(200, 200, 200);
         rect   (this.x,this.y,this.length, 20);
    },
        checkJump:  function (gameChar_x,gameChar_y  )
        {
        if (gameChar_x > this.x && 
            gameChar_x < this.x + this.length)
            {
                var d = this.y - gameChar_y;
                if (d>= 0 && d<5)
                {
                    return true;
                }                
            }
            return false;
    }
    }
    return p;
}

function Enemy (x, y, range) 
{
    this.x  =  x;
    this.y  =  y;
    this.range  = range;
    this.currentX =  x;
    this.inc  =  1;
    this.update =  function ()
    {
        this.currentX +=  this.inc ;
        //0utside the range
        if( this.currentX >= this.x + this.range)
        {
         this.inc  = -1;
        }
        else if (this.currentX < this.x )
        {
          this.inc  =  1;   
        }
    }
    
    this.draw  =  function ()
    {
        this.update() ;
        fill(255,0,0);
        stroke(0);
        strokeWeight (2);
        ellipse (this.currentX, this.y, 30,40);
        fill(255);
        stroke(0);
        ellipse (this.currentX - 8, this.y - 8, 5,5);
        ellipse (this.currentX + 8, this.y - 8, 5,5);
        fill(0);             
        triangle (this.currentX -  12, this.y - 15,this.currentX - 23, this.y - 23, this.currentX - 33, this.y - 5,);
         triangle (this.currentX +  14, this.y - 15,this.currentX + 23, this.y - 23, this.currentX + 33, this.y - 5,)
              
    }
    
    this.checkEnemy =  function (gameChar_x, gameChar_y)
    {
        var d = dist (gameChar_x, gameChar_y, this.currentX, this.y);
        if (d < 30)
        {
        return true;
        }
        return  false;
    }
    }