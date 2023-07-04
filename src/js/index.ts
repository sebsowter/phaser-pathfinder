import "phaser";
import { Scene } from "./Scene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 128,
  height: 128,
  input: {
    keyboard: false,
    gamepad: false,
    mouse: true,
    touch: true,
  },
  render: {
    pixelArt: true,
  },
  zoom: 3,
  scene: Scene,
};

window.addEventListener("load", () => new Phaser.Game(config));
