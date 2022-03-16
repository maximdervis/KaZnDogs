var foodAt;
var isFood;
var isWall;
var isEnemy;
var position;
var player;
var foodEaten = 100;
var dying = false;

class Level extends Phaser.Scene {
	constructor() {
		super('level')
	}

	preload() { 
		this.load.spritesheet('playerIdle', 'img/playeridle.png', {frameWidth: 32, frameHeight: 32}); 
		this.load.spritesheet('playerShoot', 'img/playershoot.png', {frameWidth: 32, frameHeight: 32}); 
		this.load.spritesheet('playerDie', 'img/playerdie.png', {frameWidth: 32, frameHeight: 32}); 
		this.load.spritesheet('enemyIdle1', 'img/enemyidle1.png', {frameWidth: 32, frameHeight: 32}); 
		this.load.spritesheet('enemyIdle2', 'img/enemyidle2.png', {frameWidth: 32, frameHeight: 32}); 
		this.load.spritesheet('outWall', 'img/outwalls.png', {frameWidth: 32, frameHeight: 32}); 
		this.load.spritesheet('innerWall', 'img/inwalls.png', {frameWidth: 32, frameHeight: 32}); 
		this.load.spritesheet('food', 'img/food.png', {frameWidth: 32, frameHeight: 32}); 
		this.load.spritesheet('ground', 'img/ground.png', {frameWidth: 32, frameHeight: 32}); 
		this.load.spritesheet('finish', 'img/finish.png', {frameWidth: 32, frameHeight: 32}); 
		this.load.audio('hover', ['audio/hover.mp3'])
	}

	create() {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.scale = 2;
		this.size = 32; 
		this.offset = this.size * this.scale / 2;
		this.width = 1920 / (this.size * this.scale * 2); 
		this.height = 1408 / (this.size * this.scale * 2); 
		foodAt = new Array(this.width + 1); 
		isFood = new Array(this.width + 1);
		isWall = new Array(this.width + 1);
		isEnemy = new Array(this.width + 1); 
		position = {x: 2, y: 2};
		dying = false;

		for (let x = 0; x <= this.width; x++) {
			foodAt[x] = new Array(this.height + 1);
			isFood[x] = new Array(this.height + 1);
			isWall[x] = new Array(this.height + 1);
			isEnemy[x] = new Array(this.height + 1); 
		}


		for (let x = 1; x <= this.width; x++) {
			put(this, 'outWall', x, 1);
			put(this, 'outWall', x, this.height);	
		}

		for (let y = 1; y <= this.height; y++) {
			put(this, 'outWall', 1, y);
			put(this, 'outWall', this.width, y);
		}

		addAnim(this, 'enemyIdleAnimation1', 'enemyIdle1');
		addAnim(this, 'enemyIdleAnimation2', 'enemyIdle2');


		for (let x = 2; x <= this.width - 1; x++) {
			for (let y = 2; y <= this.height - 1; y++) {
				put(this, 'innerWall', x, y);
			}
		}

		let isPath = new Array(this.width + 1); 
		let used = new Array(this.width + 1);
		let parent = new Array(this.width + 1);
		for (let x = 1; x <= this.width; x++) {
			used[x] = new Array(this.height + 1, false);
			parent[x] = new Array(this.height + 1);
			isPath[x] = new Array(this.height + 1); 
		}

		for (let x = 2; x <= this.width - 1; x++) {
			for (let y = 2; y <= this.height - 1; y++) {
				if ((x % 2 == 0) && (y % 2 == 0)) {
					put(this, 'ground', x, y);
				}
			}
		}


		dfs(this, 2, 2, used, parent);
		let current = {a: this.width - 1, b: this.height - 1}; 
		while (current.a != 2 || current.b != 2) {
			isPath[current.a][current.b] = true;
			current = parent[current.a][current.b];
		}

		for (let x = 2; x <= this.width - 1; x+=2) {
			for (let y = 2; y <= this.height - 1; y+=2) {
				let value = Phaser.Math.Between(1, 10); 
				if (x == 2 && y == 2)
					continue;
				
				if (value <= 3) {
					isFood[x][y] = true; 
					foodAt[x][y] = put(this, 'food', x, y);
				}
				else if (value <= 6 && !isPath[x][y]) {
					putEnemy(this, x, y);
					isEnemy[x][y] = true;
				}
			}
		}

		put(this, 'finish', this.width - 1, this.height - 1);
		addAnim(this, 'playerIdleAnimation', 'playerIdle');
		addAnim(this, 'playerDieAnimation', 'playerDie');

		player = put(this, 'player', 2, 2);
		player.play('playerIdleAnimation');

		this.input.keyboard.on('keyup-A', function (event) {
        	let newPosition = {x: position.x, y: position.y};
        	newPosition.x--;
        	if (checkWall(this, newPosition))
        		return; 
        	collectFood(this, newPosition);
        	checkFinish(this, newPosition);
        	checkEnemy(newPosition);
        	position = newPosition;
        	foodEaten--;
        	player.x -= 32 * 2;
    	}, this);

    	this.input.keyboard.on('keyup-S', function (event) {
        	let newPosition = {x: position.x, y: position.y}; 
        	newPosition.y++; 
        	if (checkWall(this, newPosition))
        		return; 
        	collectFood(this, newPosition);
        	checkFinish(this, newPosition);
        	checkEnemy(newPosition);
        	position = newPosition;
        	foodEaten--;
        	player.y += 32 * 2;
    	}, this);

    	this.input.keyboard.on('keyup-D', function (event) {
        	var newPosition = {x: position.x, y: position.y}; 
        	newPosition.x++; 
        	if (checkWall(this, newPosition))
        		return; 
        	collectFood(this, newPosition);
        	checkFinish(this, newPosition);
        	checkEnemy(newPosition);
        	position = newPosition;
        	foodEaten--;
        	player.x += 32 * 2;
    	}, this);

    	this.input.keyboard.on('keyup-W', function (event) {
        	var newPosition = {x: position.x, y: position.y};
        	newPosition.y--; 
        	if (checkWall(this, newPosition))
        		return;
        	collectFood(this, newPosition);
        	checkFinish(this, newPosition);
        	checkEnemy(newPosition);
        	position = newPosition;
        	foodEaten--;
        	player.y -= 32 * 2;
    	}, this);

		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    	this.foodText = this.add.text(screenCenterX, 30, 'ЗДОРОВЬЕ ' + foodEaten, {fontSize: 60, color: '#EB6377'}).setOrigin(0.5).setShadow(3,3,'black',1,true,true);
    	let exit = this.add.text(100, 30, 'ВЫЙТИ', {fontSize: 60, color: '#D0FAE7'}).setOrigin(0.5).setShadow(3,3,'black',1,true,true).setInteractive();
    	exit.on('pointerdown', function(pointer) { this.scene.stop('level'); this.scene.start('mainMenu');  foodEaten = 100; }, this);
    	let hover = this.sound.add('hover', {volume: 0.3});
    	addTextAnimation(exit, hover);
	}

	update() {
		this.foodText.text = "ЗДОРОВЬЕ " + foodEaten;
		if (dying) {
			foodEaten -= 5;
		}

		if (foodEaten <= 0) {
			foodEaten = 100;
			this.scene.start('gameOver');
		}
	}
}

function checkEnemy(position) {
	if (isEnemy[position.x][position.y]) {
		player.play('playerDieAnimation');
		dying = true;
	}
}

function checkFinish(scene, position) {
	if (position.x == (scene.width - 1) && position.y == (scene.height - 1)) {
		
		scene.scene.restart('level');
	}
}

function collectFood(scene, position) {
	if (!isFood[position.x][position.y])
		return;
	isFood[position.x][ position.y] = false;
	foodEaten+=7; 
	let food = foodAt[position.x][position.y];
	scene.collectedFood++;
	food.destroy();
	
}

function checkWall(scene, position) {
	if (isWall[position.x][position.y])
		return true; 
	return false; 
}

function dfs(scene, x, y, used, parent) {
	used[x][y] = true;


	let neighbours = new Array();
	if (correct(scene, x + 2, y) && !used[x + 2][y])
		neighbours[neighbours.length] = {a: x + 2, b: y};
	if (correct(scene, x - 2, y) && !used[x - 2][y])
		neighbours[neighbours.length] = {a: x - 2, b: y};
	if (correct(scene, x, y + 2) && !used[x][y + 2])
		neighbours[neighbours.length] = {a: x, b: y + 2};
	if (correct(scene, x, y - 2) && !used[x][y - 2])
		neighbours[neighbours.length] = {a: x, b: y - 2};

	neighbours.sort(() => Math.random() - 0.5);
	for (let i = 0; i < neighbours.length; i++) {
		let neighbour = neighbours[i];
		if (used[neighbour.a][neighbour.b])
			continue;

		let passageX = (neighbour.a + x) / 2; 
		let passageY = (neighbour.b + y) / 2; 

		put(scene, 'ground', passageX, passageY); 

		parent[neighbour.a][neighbour.b] = {a: x, b: y};
		dfs(scene, neighbour.a, neighbour.b, used, parent);
	}
}

function correct(scene, x, y) {
	return x > 1 && y > 1 && x < scene.width && y < scene.height;
}

function putEnemy(scene, x, y) {
	let newValue = Phaser.Math.Between(1, 2); 
	let enemy = put(scene, (newValue == 1) ? 'enemyIdle1' : 'enemyIdle2', x, y);
	enemy.play((newValue == 1) ? 'enemyIdleAnimation1' : 'enemyIdleAnimation2');
}

function addAnim(scene, key, from) {
	scene.anims.create({
		key: key,
		frames: scene.anims.generateFrameNumbers(from),
		frameRate: 5,
		repeat: -1
	});
}

function put(scene, name, x, y) {
	let sprite = scene.add.sprite(scene.offset + (x - 1) * scene.offset * 2, scene.offset + (y - 1) * scene.offset * 2, name).setScale(scene.scale);
	sprite.setFrame(Phaser.Math.Between(0, scene.anims.generateFrameNumbers(name).length - 1));
	if (name == 'innerWall' || name == 'outWall') {
		isWall[x][y] = true; 
	} else
	if (name == 'ground') {
		isWall[x][y] = false; 
	} else
	if (name == 'food') {
		isFood[x][y] = true; 
		foodAt[x][y] = sprite;
	}
	return sprite;
}


