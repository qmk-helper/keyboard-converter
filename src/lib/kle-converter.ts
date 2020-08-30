import { KleKey, KleKeyboard, serialize } from "@buckwich/kle-serial";
import { IKey, IKeyboard, IKeymap, ILayout } from "./keyboard";
import { Label } from "./keycodes";

export class KleConverter {
  kleKeyboard: KleKeyboard;
  keyboard: IKeyboard;
  selectedLayout?: number;

  constructor(keyboard: IKeyboard) {
    this.keyboard = keyboard;
    this.kleKeyboard = new KleKeyboard();
    this.kleKeyboard.meta.name = this.keyboard.keyboard_name;
    this.kleKeyboard.meta.author = this.keyboard.maintainer;
  }
  clearKeys() {
    this.kleKeyboard.keys = [];
  }
  useLayout(id: number | string) {
    if (typeof id === "number") {
      this.selectedLayout = id;
    } else {
      this.selectedLayout = this.keyboard.layouts.findIndex(
        (layout) => layout.name === id
      );
    }
    let layout = this.keyboard.layouts[this.selectedLayout];
    if (!layout) {
      console.log("Invalid layout");
    } else {
      this.generateKleKeys(layout);
    }
  }

  allLayouts() {
    this.keyboard.layouts.forEach((layout, index) => {
      this.addDecal(index * (this.keyboard.height + 1), layout.name);
      this.generateKleKeys(
        layout,
        undefined,
        index * (this.keyboard.height + 1) + 1
      );
    });
  }

  useKeymap(id: number | string) {
    let keymap: IKeymap | undefined;
    if (!this.keyboard.keymaps) {
      console.log("no keymaps defined");
      return;
    }
    if (typeof id === "number") {
      keymap = this.keyboard.keymaps[id];
    } else {
      keymap = this.keyboard.keymaps.find((layout) => layout.name === id);
    }

    if (!keymap) {
      console.log("no keymap found");
      return;
    }

    let layout = this.keyboard.layouts.find(
      (layout) => layout.name === keymap?.layout
    );

    if (layout !== undefined) {
      keymap.layers.forEach((layer, index) => {
        if (layout !== undefined) {
          this.addDecal(index * (this.keyboard.height + 1), "Layer " + index);
          this.generateKleKeys(
            layout,
            layer,
            index * (this.keyboard.height + 1) + 1
          );
        }
      });
    }
  }

  serialize(): object {
    return serialize(this.kleKeyboard);
  }
  private generateKleKeys(layout: ILayout, labels: Label[] = [], yOffset = 0) {
    layout.keys.forEach((key, index) => {
      this.kleKeyboard.keys.push(
        this.keylabelToKleKey(key, labels[index], yOffset)
      );
    });
  }
  private keylabelToKleKey(key: IKey, label?: Label, yOffset = 0): KleKey {
    let kleKey = new KleKey();
    kleKey.x = key.x;
    kleKey.y = key.y + yOffset;
    kleKey.width = key.width;
    kleKey.width2 = key.oddShape?.width || key.width;
    kleKey.height = key.height;
    kleKey.height2 = key.oddShape?.height || key.height;
    if (label?.L) {
      kleKey.labels = [label.L, "", "", "", "", "", label.l];
    } else {
      kleKey.labels = [label?.l || ""];
    }
    if (label?.style) {
      kleKey.color = label?.style.backgroundColor || "";
      kleKey.textColor = [label?.style.textColor || "#000000"];
      kleKey.textSize = [label?.style.textSize || 3];
    }

    return kleKey;
  }
  private addDecal(y: number, text: string) {
    let decalKey = new KleKey();
    decalKey.x = 0;
    decalKey.y = y;
    decalKey.width = this.keyboard.width;
    decalKey.width2 = this.keyboard.width;
    decalKey.decal = true;
    decalKey.labels = [text];
    this.kleKeyboard.keys.push(decalKey);
  }
}
