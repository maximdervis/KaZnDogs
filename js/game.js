var config = {
  width: 960, 
  height: 704,
  backgroundColor: '#313B36',
  scene: [MainMenu,
          Level,
          GameOver],
  pixelArt: true,
  scale: {
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH
  }, 
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  }
}

window.onload = function() { 
  var game = new Phaser.Game(config);
}