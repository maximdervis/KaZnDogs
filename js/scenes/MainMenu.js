var music = null;

class MainMenu extends Phaser.Scene {
	constructor() {
		super('mainMenu')
	}

	preload() {
		this.load.audio('mainMenuMusic', ['audio/main.mp3']);
		this.load.audio('hover', ['audio/hover.mp3'])
	}

	create() {
		let hover = this.sound.add('hover', {volume: 0.3});
		if (music != null)
			music.stop();
		music = this.sound.add('mainMenuMusic', {loop: true});
		music.play();

		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
		let title = this.add.text(screenCenterX, screenCenterY - 80, 'Kaz&Dogs', {fontSize: 100}).setOrigin(0.5);
		let play = this.add.text(screenCenterX, screenCenterY + 30, 'Играть', {fontSize: 50, color: '#D0FAE7'}).setOrigin(0.5).setInteractive();
		let rules = this.add.text(screenCenterX, screenCenterY + 80, 'Правила игры', {fontSize: 50, color: '#D0FAE7'}).setOrigin(0.5).setInteractive();
		let about = this.add.text(screenCenterX, screenCenterY + 130, 'Об авторе', {fontSize: 50, color: '#D0FAE7'}).setOrigin(0.5).setInteractive();

		addTextAnimation(play, hover);
		addTextAnimation(rules, hover);
		addTextAnimation(about, hover);

		addTextShadow(title);
		addTextShadow(play);
		addTextShadow(rules);
		addTextShadow(about);

		play.on('pointerdown', function(pointer) { this.scene.start('level'); }, this);
		rules.on('pointerdown', function(pointer) { window.open('gamerules.html', '_self'); });
		about.on('pointerdown', function(pointer) { window.open('about.html', '_self'); });
	}
}

function addTextAnimation(text, sound) {
	text.on('pointerover', function(pointer) { text.setColor('#667A71'); sound.play(); console.log(1); });
	text.on('pointerout', function(pointer) { text.setColor('#D0FAE7') });
}

function addTextShadow(text) {
	text.setShadow(3,3,'black',1,true,true);
}