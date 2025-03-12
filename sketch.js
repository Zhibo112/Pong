let video
let handPose;
let hands = [];
let PongLeft
let PongRight
let loseSound;

let leftY,rightY, bx,by, _x,_y;

let speed, startspeed, bar, space, bgcolor, barw, limit, maxspeed, bsize, scaleY;
let rscore=0, lscore=0;
let LS, RS

let options = {
  maxHands: 2,
  flipped: true, // boolean
  runtime: "mediapipe", // also "mediapipe"
  // modelType: "lite", // also "lite"
};

function preload(){
  handPose = ml5.handPose(options);
  PongLeft = loadSound('LeftPong.mp3');
  PongRight = loadSound('RightPong.mp3');
  loseSound = loadSound('Loose.mp3');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scaleY = windowHeight/480
}

function mousePressed(){
  console.log(hands);
}

function gotHand(results){
  hands = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, {flipped:true});
  video.size(1280, 960)
  video.hide();
  handPose.detectStart(video, gotHand);
  rectMode(CENTER);
  textSize(80);
  bx=width/2;
  by=height/2;
  
  
  startspeed = 4
  speed = startspeed;
  _x=speed;
  _y=speed;
  bar = 200;
  barw = 30;
  space = 80;
  bgcolor = 78;
  limit = height/8;
  maxspeed = 20;
  bsize = 35;
  scaleY = windowHeight/480;
  
  L = new p5.Oscillator();
  R = new p5.Oscillator();
  Ball= new p5.Oscillator();
  L.setType('sine');
  Ball.setType('sawtooth')
  
  print(video.width, video.height)
}

function draw() {
  
  noStroke();
  
  image(video, 0, 0, width, height);
  background(122+bgcolor, 200);
  
  
  if(hands.length > 0){
    for(let hand of hands){
      
      // push();
      // fill(255);
      // circle(hand.keypoints[0].x,hand.keypoints[0].y, 30)
      // pop();
      if(hand.confidence < 0.1){
        print("no confidence")}
      
      if(hand.handedness == "Left"){
        leftY = hand.keypoints[0].y*scaleY;
        // push();
        // fill(255,0,0);
        // circle(hand.keypoints[0].x,hand.keypoints[0].y, 30)
        // pop();
      }else{
        rightY = hand.keypoints[0].y*scaleY;
        // push();
        // fill(0,255,0);
        // circle(hand.keypoints[0].x,hand.keypoints[0].y, 30)
        // pop();
      }
      
      fill(122-bgcolor);
      rect(width/2, limit/2, width, limit);
      rect(width/2, height-limit/2, width, limit)
      rect(width/2, height/2, 3, height);
      
      rect(space, leftY, barw, bar);
      rect(width-space, rightY, barw, bar);
      
      push();
      fill(122+bgcolor);
      text(lscore, width/10, limit-10);
      text(rscore, width*9/10, limit-10);
      pop();
      
      if(by<=limit){
        _y = speed;
      }else if(by>=height-limit){
        _y = speed*-1;
      }
      
      
      
      if(bx<=0){
        
        leftLose();
        
      }else if(bx>=width){
        
        rightLose();
        
      }
      
      
      
      if(bx<space && bx>(space-barw) && abs(by-leftY)<bar/2){
        leftBounce();
      }
      else if(bx>(width-space) && bx<(width-space+barw) && abs(by-rightY)<bar/2){
        rightBounce();
      }
      
      
      
      
      bx = bx+_x;
      by = by+_y;
      
      
      circle(bx, by, bsize);
      
      L.freq(leftY);
      L.start();
      R.freq(rightY);
      R.start();
      
      
      
    }
    
  }
}


function leftBounce(){
  print("left bounce", speed)
        speed = lerp(speed, maxspeed, 0.04);
        _x = speed;
        PongLeft.play();
}

function rightBounce(){
  print("right bounce", speed)
        speed = lerp(speed, maxspeed, 0.04);
        _x = speed*-1;
        PongRight.play();
}

function leftLose(){
  print("left lose", speed)
        bx = width/2;
        by = random(limit, height-limit);
        bgcolor = bgcolor*-1
        speed = startspeed;
        _x = speed;
        rscore++;
        loseSound.play();
}

function rightLose(){
  print("right lose", speed)
        bx = width/2;
        by = random(limit, height-limit);
        bgcolor = bgcolor*-1
        speed = startspeed;
        _x = speed*-1;
        lscore++;
        loseSound.play();
}
  
