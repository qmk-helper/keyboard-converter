import { classToPlain, plainToClass } from "class-transformer";
import "reflect-metadata";
import { IKeyboard, IKeymap } from "./keyboard";
import { Label, Labels } from "./keycodes";
import { KleConverter } from "./kle-converter";
import { QmkKeyboard } from "./qmk-keyboard.interface";
import { QmkKeymap } from "./qmk-keymap.interface";
export class KeyboardConverter {
  keyboard: IKeyboard = {
    keyboard_name: "",
    keyboard_folder: "",
    url: "",
    maintainer: "",
    width: 0,
    height: 0,
    layouts: [],
    keymaps: []
  };

  private labels = new Labels();
  importQmkKeyboard(qmkKeyboardJson: any) {
    this.keyboard = plainToClass(QmkKeyboard, qmkKeyboardJson);
  }
  getKeyboard(simplified = false): object {
    if (simplified) {
      return classToPlain(this.keyboard);
    } else {
      return this.keyboard;
    }
  }
  importQmkKeymap(qmkKeymapJson: any) {
    let qmkKeymap = plainToClass(QmkKeymap, qmkKeymapJson);
    let keymap: IKeymap = {
      name: qmkKeymap.keymap,
      layers: [],
      layout: qmkKeymap.layout
    };
    qmkKeymap.layers.forEach((qmkLayer) => {
      let layer: Label[] = [];
      qmkLayer.forEach((key) => {
        layer.push(this.labels.getLabel(key));
      });
      keymap.layers.push(layer);
    });
    this.keyboard.keymaps.push(keymap);
    // console.log(keymap);
  }
  exportQmkKeymap(): string {
    throw new Error("Not Implemented");
  }
  importKleKeyboard(kleKeyboardJson: any) {
    throw new Error("Not Implemented");
  }
  exportKleKeyboard(): object {
    let kleConverter = new KleConverter(this.keyboard);
    kleConverter.useKeymap(0);
    return kleConverter.serialize();
  }
}
