import Phaser from "phaser";
export default class world extends Phaser.Scene {
  constructor() {
    super("world");
    this.zoomFactor = 2;
  }

  init(data) {
    console.log("*** init world");
  }

  preload() {}

  create() {
    console.log("*** create world: ", this);
    let map = this.make.tilemap({
      key: "map0",
    });

    let groundTiles = map.addTilesetImage("ultima", "u3");

    this.grass = map
      .createLayer("grassLayer", groundTiles, 0, 0)
      .setScale(this.zoomFactor);
    this.mapLayer = map
      .createLayer("mapLayer", groundTiles, 0, 0)
      .setScale(this.zoomFactor);

    let moongatePos = map.findObject(
      "objectLayer",
      (obj) => obj.name === "moonGate"
    );
    let playerPos = map.findObject(
      "objectLayer",
      (obj) => obj.name === "player"
    );
    let paladinPos = map.findObject(
      "objectLayer",
      (obj) => obj.name === "paladin"
    );
    let fighterPos = map.findObject(
      "objectLayer",
      (obj) => obj.name === "fighter"
    );
    let thiefPos = map.findObject("objectLayer", (obj) => obj.name === "thief");
    let valkriePos = map.findObject(
      "objectLayer",
      (obj) => obj.name === "valkrie"
    );
    let clericPos = map.findObject(
      "objectLayer",
      (obj) => obj.name === "cleric"
    );

    this.player = {};
    this.player.x = 300;
    this.player.y = 300;
    this.player = this.physics.add
      .sprite(this.player.x, this.player.y, "u3")
      .play("ranger")
      .setScale(this.zoomFactor);

    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels * this.zoomFactor,
      map.heightInPixels * this.zoomFactor + 64
    );

    this.cameras.main.startFollow(this.player);

    // mini map
    this.minimap = this.cameras
      .add(480, 10, 150, 150)
      .setZoom(0.2)
      .setName("mini");
    this.minimap.setBackgroundColor(0x000000);
    this.minimap.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();

    var config = {
      x: 100,
      y: 400,
      radius: 50,
      base: this.add.circle(0, 0, 50, 0x888888),
      thumb: this.add.circle(0, 0, 25, 0xcccccc),
    };

    this.text = this.add.text(20, 450, "0", {
      fontSize: "20px",
      fill: "#ffffff",
    });
    // fix the text to the camera
    this.text.setScrollFactor(0);

    console.log("this.plugins: ", this.plugins.get("rexVirtualJoystick"))

    this.joyStick = this.plugins
      .get("rexVirtualJoystick")
      .add(this, config)
      .on("update", this.dumpJoyStickState, this);
    this.dumpJoyStickState();
  }

  update() {
    let speed = 256;

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    } else {
      this.player.body.setVelocity(0);
    }
  }

  dumpJoyStickState() {
    this.cursorKeys = this.joyStick.createCursorKeys();
    var s = "Key down: ";
    for (var name in this.cursorKeys) {
      if (this.cursorKeys[name].isDown) {
        s += name + " ";
      }
    }
    let speed = 256;
    if (this.cursorKeys.down.isDown) {
      this.player.body.setVelocityY(speed);
    } else if (this.cursorKeys.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursorKeys.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.flipX = false;
    } else if (this.cursorKeys.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.flipX = true;
    } else {
      this.player.body.setVelocity(0);
    }

    s += "\n";
    s += "Force: " + Math.floor(this.joyStick.force * 100) / 100 + "\n";
    s += "Angle: " + Math.floor(this.joyStick.angle * 100) / 100 + "\n";
    this.text.setText(s);
  }
}