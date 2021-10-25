// a shader variable
let theShader;
let shaderBg;
let skyGrad;

function preload(){
  // load the shader
  theShader = loadShader('shader_skygrad/skygrad.vert', 'shader_skygrad/skygrad.frag');
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // initialize the createGraphics layers
  shaderBg = createGraphics(windowWidth, windowHeight, WEBGL);
  
  // turn off the cg layers stroke
  shaderBg.noStroke();
  
  skyGrad = [1,1,1];
}

function draw() {
	background(255);

	//-------------------
	// 空を描画
	//-------------------
	draw_sky()
	noStroke();

	push();
	angleMode(DEGREES);
	fill(color(0, 0, 0));
	translate(-0.25*windowWidth, 0.2*windowHeight);
	scale(0.003*windowWidth, 0.005*windowHeight);
	rotateZ(45);
	rect(0, 0, 50, 50);
	pop();

	push();
	angleMode(DEGREES);
	fill(color(0, 0, 0));
	translate(-0.15*windowWidth, 0.25*windowHeight);
	scale(0.002*windowWidth, 0.004*windowHeight);
	rotateZ(45);
	rect(0, 0, 50, 50);
	pop();

	push();
	angleMode(DEGREES);
	fill(color(0, 0, 0));
	translate(0.35*windowWidth, 0.2*windowHeight);
	scale(0.007*windowWidth, 0.008*windowHeight);
	rotateZ(45);
	rect(0, 0, 50, 50);
	pop();


	fill(color(08, 08, 24));
	rect(-windowWidth/2, windowHeight/2.8, windowWidth, windowHeight/5.0);

	//skyGrad = createVector(0.1, 0.1, 0.3);
	//fill(color(104,90,78));
	//rect(-windowWidth/2.3, windowHeight/3.2, windowWidth/150, windowHeight/11.0);
	//rect(-windowWidth/5.0, windowHeight/3.2, windowWidth/150, windowHeight/11.0);
	//rect(windowWidth/17.0, windowHeight/3.2, windowWidth/150, windowHeight/11.0);
	//rect(windowWidth/3.0,  windowHeight/3.2, windowWidth/150, windowHeight/11.0);

	/*
	push();
	fill(color(58, 58, 74));
	rect(windowWidth/6.0, windowHeight/3.1, windowWidth/8, windowHeight/7.0);
	pop();
	*/

}

function draw_sky()
{
	push();

	// 空の時間経過処理
	let time = millis() *0.001;
	let morning = createVector(0.79, 0.9, 1.0);
	let afternoon = createVector(0.9, 1.0, 1.1);
	let evening = createVector(1.1,0.9,0.9);
	let midnight = createVector(0.1,0.1,0.3);

	let morningTime = createVector(1.0, 0.0);
	let afternoonTime = createVector(0.0, 1.0);
	let eveningTime = createVector(-1.0, 0.0);
	let midnightTime = createVector(0.0,-1.0);

	// 1,0 -> 0,1 -> -1,0 -> 0,-1
	let clockVec = createVector(cos(time), sin(time));
	let timeTable = [morning, evening, midnight, midnight];
	let dotArray = [clockVec.dot(morningTime), clockVec.dot(afternoonTime), clockVec.dot(eveningTime), clockVec.dot(midnightTime)];
	let highest = -1;
	let maxidx = 0;
	for (let i = 0; i<dotArray.length; i++) {
		if (highest < dotArray[i]) {
			highest = dotArray[i];
			maxidx = i;
		}
	}
	highest = -1;
	let sndidx = 0;
	for (let i = 0; i<dotArray.length; i++) {
		if (highest < dotArray[i] && maxidx != i) {
			highest = dotArray[i];
			sndidx = i;
		}
	}
	skyGrad = p5.Vector.lerp(timeTable[sndidx], timeTable[maxidx], lerp(0.5, 1.0, (dotArray[maxidx]-(1/sqrt(2))) / (1.0-(1/sqrt(2)))));	

	// shader() sets the active shader with our shader
	// instead of just setting the active shader we are passing it to the shaderBg graphic
	shaderBg.shader(theShader);

	// here we're using setUniform() to send our uniform values to the shader
	// set uniform is smart enough to figure out what kind of variable we are sending it,
	// so there's no need to cast (unlike processing)
	theShader.setUniform("u_resolution", [windowWidth*2, windowHeight*2]);
	theShader.setUniform("u_skygrad", [skyGrad.x, skyGrad.y, skyGrad.z]);
	theShader.setUniform("u_time", millis() / 1000.0);
	theShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, windowHeight, windowHeight, 0)]);

	// rect gives us some geometry on the screen
	// passing the shaderBg graphic geometry to render on
	shaderBg.rect(-windowWidth/2, -windowHeight/2,windowWidth,windowHeight);

	texture(shaderBg);
	noStroke();
	rect(-windowWidth/2, -windowHeight/2, windowWidth, windowHeight-windowHeight/7.0);
	//rect(-windowWidth/2, -windowHeight/2, windowWidth, windowHeight);

	pop();
}