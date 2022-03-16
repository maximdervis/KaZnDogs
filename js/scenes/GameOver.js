class GameOver extends Phaser.Scene {
	constructor() {
		super('gameOver')
	}

	create() {
		const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
		let title = this.add.text(screenCenterX, screenCenterY, 'ИГРА ОКОНЧЕНА', {fontSize: 100}).setOrigin(0.5);
		addTextShadow(title);
		this.time = 300; 
	}

	update() {
		this.time--;
		if (this.time <= 0) {
			this.scene.start('mainMenu');
		}
	}
}