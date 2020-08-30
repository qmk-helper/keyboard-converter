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
  importQmkKeyboard(qmkKeyboardJson: JSON) {
    this.keyboard = plainToClass(QmkKeyboard, qmkKeyboardJson);
  }
  exportQmkKeyboard(simplified = true): object {
    if (simplified) {
      return classToPlain(this.keyboard);
    } else {
      return this.keyboard;
    }
  }
  importQmkKeymap(qmkKeymapJson: JSON) {
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
  importKleKeyboard(kleKeyboardJSON: JSON) {
    throw new Error("Not Implemented");
  }
  exportKleKeyboard(): object {
    let kleConverter = new KleConverter(this.keyboard);
    kleConverter.useKeymap(0);
    return kleConverter.serialize();
  }
}
// export function keyboard2kle(
//   qmkKeyboard: QmkKeyboard,
//   qmkKeymap?: QmkKeymap
// ): KleKeyboard {
//   if (!qmkKeymap) {
//     console.log("No keymap selected. Outputing available layouts:");
//     return qmkToKleKeyboard(qmkKeyboard);
//   } else {
//     let combinedQmkKeyboard = combineQmkKeyboardWithKeymap(
//       qmkKeyboard,
//       qmkKeymap
//     );
//     let combinedKleKeyboard = qmkToKleKeyboard(combinedQmkKeyboard);
//     return combinedKleKeyboard;
//   }
// }
// function qmkToKleKeyboard(qmkKeyboard: QmkKeyboard): KleKeyboard {
//   let kleKeyboard = new KleKeyboard();
//   kleKeyboard.meta.name = `${qmkKeyboard.keyboard_name}`;
//   let yOffset = 0;
//   for (const [key, layout] of Object.entries(qmkKeyboard.layouts)) {
//     console.log(key);
//     addKeyboard(kleKeyboard, yOffset, key, qmkKeyboard.width, layout);

//     yOffset += qmkKeyboard.height + 1;
//   }
//   return kleKeyboard;
// }
// function combineQmkKeyboardWithKeymap(
//   qmkKeyboard: QmkKeyboard,
//   qmkKeymap: QmkKeymap
// ): QmkKeyboard {
//   if (qmkKeyboard.layouts[qmkKeymap.layout]) {
//     let qmkLayout = qmkKeyboard.layouts[qmkKeymap.layout];
//     // delete qmkKeyboard.layouts;
//     qmkKeyboard.layouts = {};
//     console.log("Success");
//     console.log(qmkLayout);
//     // let layoutsfsdfsfdsfds: QmkLayouts = {};
//     qmkKeymap.layers?.forEach((layer, index) => {
//       let layout = layerToLayout(qmkLayout.layout, layer);
//       console.log("Layout" + index);
//       console.log(layout);
//       qmkKeyboard.layouts["Layer" + index] = JSON.parse(
//         JSON.stringify({
//           layout
//         })
//       );
//     });

//     return qmkKeyboard;
//   } else {
//     throw new Error("Unable to map layouts, please specify");
//   }
// }
